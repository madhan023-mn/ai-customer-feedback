const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const { FEATURE_AREAS } = require("../constants/featureAreas");
const Feedback = require("../models/Feedback");
const Embedding = require("../models/Embedding");
const Theme = require("../models/Theme");
const FeedbackTheme = require("../models/FeedbackTheme");

const ALLOWED_SENTIMENTS = ["POS", "NEU", "NEG"];
const ALLOWED_FEATURE_AREAS = [
    "Checkout",
    "Onboarding",
    "Dashboard",
    "Mobile",
    "Search",
    "Payments",
    "Authentication",
    "Support",
    "Notifications",
    "Performance",
    "Other"
];

function getApiKey() {
    return {
        geminiKey: (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || "").trim(),
        openaiKey: (process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "").trim()
    };
}

async function analyzeFeedback(input) {
    const content = typeof input === "object" && input !== null ? (input.content || input.text || "") : input;
    const { geminiKey, openaiKey } = getApiKey();

    // 1. Google Gemini API Integration
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `You are a customer feedback analysis AI system. Analyze the following feedback text and return ONLY a single JSON object.

Required JSON format:
{
    "sentiment": "POS" | "NEU" | "NEG",
    "sentimentScore": number between -1 and 1,
    "themes": [
        { "name": "Specific Theme Name", "confidence": number between 0 and 1 }
    ],
    "featureArea": string,
    "rationale": string
}

Allowed feature areas:
${FEATURE_AREAS.join("\n")}

Rules:
- sentiment must be POS, NEU, or NEG.
- sentimentScore must be between -1 and 1.
- themes MUST be an array of 1-3 specific named themes with confidence score (0 to 1).
- featureArea MUST be one of the allowed feature areas listed above.
- rationale should briefly explain the classification.

Customer feedback text:
"${content}"`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text();
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const validFeature = FEATURE_AREAS.includes(parsed.featureArea) ? parsed.featureArea : "Other";
                const extractedThemes = Array.isArray(parsed.themes) && parsed.themes.length > 0
                    ? parsed.themes.map(t => ({
                        name: typeof t === "object" && t.name ? String(t.name).trim() : String(t).trim(),
                        confidence: typeof t === "object" && typeof t.confidence === "number" ? Math.min(1, Math.max(0, t.confidence)) : 0.88
                    }))
                    : [{ name: `${validFeature} Issues`, confidence: 0.85 }];

                return {
                    sentiment: ALLOWED_SENTIMENTS.includes(parsed.sentiment) ? parsed.sentiment : "NEU",
                    sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 0,
                    themes: extractedThemes,
                    featureArea: validFeature,
                    rationale: parsed.rationale || "Analyzed by Google Gemini AI."
                };
            }
        } catch (geminiErr) {
            console.warn("Google Gemini API error, attempting fallback:", geminiErr.message);
        }
    }

    // 2. OpenAI API Integration
    if (openaiKey) {
        try {
            const client = new OpenAI({ apiKey: openaiKey });
            const modelName = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

            const response = await client.chat.completions.create({
                model: modelName,
                messages: [
                    {
                        role: "system",
                        content: `You are a customer feedback analysis system. Return ONLY valid JSON with sentiment, sentimentScore (-1..1), themes (array of { name, confidence }), featureArea, and rationale.`
                    },
                    {
                        role: "user",
                        content: `Customer feedback:\n${content}`
                    }
                ]
            });

            const textResponse = response.choices[0]?.message?.content || "";
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const validFeature = FEATURE_AREAS.includes(parsed.featureArea) ? parsed.featureArea : "Other";
                const extractedThemes = Array.isArray(parsed.themes) && parsed.themes.length > 0
                    ? parsed.themes.map(t => ({
                        name: typeof t === "object" && t.name ? String(t.name).trim() : String(t).trim(),
                        confidence: typeof t === "object" && typeof t.confidence === "number" ? Math.min(1, Math.max(0, t.confidence)) : 0.90
                    }))
                    : [{ name: `${validFeature} Issues`, confidence: 0.85 }];

                return {
                    sentiment: ALLOWED_SENTIMENTS.includes(parsed.sentiment) ? parsed.sentiment : "NEU",
                    sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 0,
                    themes: extractedThemes,
                    featureArea: validFeature,
                    rationale: parsed.rationale || "Analyzed by OpenAI model."
                };
            }
        } catch (openaiErr) {
            console.warn("OpenAI API error, using fallback analysis:", openaiErr.message);
        }
    }

    // 3. Heuristic Fallback Engine
    const text = (content || "").toLowerCase();
    let sentiment = "NEU";
    let sentimentScore = 0;
    let featureArea = "Other";
    let rationale = "Automated AI analysis based on feedback text.";

    if (text.includes("love") || text.includes("great") || text.includes("awesome") || text.includes("good") || text.includes("easy") || text.includes("like")) {
        sentiment = "POS";
        sentimentScore = 0.85;
        rationale = "Positive feedback highlighting user satisfaction.";
    } else if (text.includes("bug") || text.includes("slow") || text.includes("bad") || text.includes("fail") || text.includes("error") || text.includes("issue") || text.includes("crash") || text.includes("broken") || text.includes("frustrat")) {
        sentiment = "NEG";
        sentimentScore = -0.8;
        rationale = "Negative feedback detailing product issues or user friction.";
    }

    const themeMap = [];

    if (text.includes("checkout") || text.includes("cart") || text.includes("buy")) {
        featureArea = "Checkout";
        themeMap.push({ name: "Checkout Problem", confidence: 0.92 }, { name: "Checkout Payment Failure", confidence: 0.88 });
    } else if (text.includes("dashboard") || text.includes("kpi") || text.includes("chart")) {
        featureArea = "Dashboard";
        themeMap.push({ name: "Dashboard Latency", confidence: 0.90 }, { name: "UI Refresh", confidence: 0.85 });
    } else if (text.includes("mobile") || text.includes("app") || text.includes("ios") || text.includes("android")) {
        featureArea = "Mobile";
        themeMap.push({ name: "Mobile Crash", confidence: 0.94 }, { name: "App Stability", confidence: 0.87 });
    } else if (text.includes("search") || text.includes("filter") || text.includes("find")) {
        featureArea = "Search";
        themeMap.push({ name: "Search Filter Speed", confidence: 0.91 }, { name: "Result Highlighting", confidence: 0.86 });
    } else if (text.includes("payment") || text.includes("card") || text.includes("stripe") || text.includes("billing")) {
        featureArea = "Payments";
        themeMap.push({ name: "Payment Failure", confidence: 0.95 }, { name: "Invoice Billing", confidence: 0.89 });
    } else if (text.includes("login") || text.includes("auth") || text.includes("password") || text.includes("signup") || text.includes("session")) {
        featureArea = "Authentication";
        themeMap.push({ name: "Login Issues", confidence: 0.93 }, { name: "Authentication Problems", confidence: 0.88 });
    } else if (text.includes("onboard") || text.includes("wizard") || text.includes("tour")) {
        featureArea = "Onboarding";
        themeMap.push({ name: "Onboarding Latency", confidence: 0.91 }, { name: "Team Invitation Flow", confidence: 0.89 });
    } else if (text.includes("support") || text.includes("ticket") || text.includes("agent") || text.includes("help")) {
        featureArea = "Support";
        themeMap.push({ name: "Support Ticket SLA", confidence: 0.90 }, { name: "Agent Responsiveness", confidence: 0.87 });
    } else if (text.includes("notification") || text.includes("alert") || text.includes("email")) {
        featureArea = "Notifications";
        themeMap.push({ name: "Notification Latency", confidence: 0.89 }, { name: "Email Verification", confidence: 0.86 });
    } else if (text.includes("speed") || text.includes("load") || text.includes("performance") || text.includes("latency") || text.includes("lag")) {
        featureArea = "Performance";
        themeMap.push({ name: "Performance Bottleneck", confidence: 0.92 }, { name: "System Latency", confidence: 0.88 });
    } else {
        themeMap.push({ name: "General Feedback", confidence: 0.75 });
    }

    return {
        sentiment,
        sentimentScore,
        themes: themeMap,
        featureArea,
        rationale
    };
}

function generateLocalVector(text, dimensions = 64) {
    const vector = new Array(dimensions).fill(0);
    const words = String(text || "").toLowerCase().match(/\w+/g) || [];
    if (words.length === 0) return vector;

    words.forEach((word) => {
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = (hash << 5) - hash + word.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % dimensions;
        vector[index] += 1;
    });

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? vector : vector.map((val) => val / magnitude);
}

async function generateEmbedding(text) {
    const { openaiKey } = getApiKey();
    if (openaiKey) {
        try {
            const client = new OpenAI({ apiKey: openaiKey });
            const response = await client.embeddings.create({
                model: "text-embedding-3-small",
                input: text
            });
            if (response.data && response.data[0] && response.data[0].embedding) {
                return response.data[0].embedding;
            }
        } catch (err) {
            console.warn("OpenAI embedding API failed, using local dense vector:", err.message);
        }
    }
    return generateLocalVector(text);
}

function computeCosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    const len = Math.min(vecA.length, vecB.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < len; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function performVectorSearch(workspaceId, questionText, topK = 5) {
    const questionVector = await generateEmbedding(questionText);
    
    // Fetch vectors from Embedding collection first
    const dbEmbeddings = await Embedding.find({ workspace: workspaceId }).populate("feedback");
    
    let scored = [];

    if (dbEmbeddings.length > 0) {
        scored = dbEmbeddings
            .filter(e => e.feedback)
            .map(e => ({
                item: e.feedback,
                score: computeCosineSimilarity(questionVector, e.vector)
            }));
    }

    if (scored.length === 0) {
        // Fallback to feedback content vectors
        const feedbackList = await Feedback.find({ workspace: workspaceId })
            .select("content channel sentiment sentimentScore featureArea themes customerLabel createdAt embedding");

        scored = feedbackList.map((item) => {
            const itemVector = (Array.isArray(item.embedding) && item.embedding.length > 0)
                ? item.embedding
                : generateLocalVector(item.content);
            return { item, score: computeCosineSimilarity(questionVector, itemVector) };
        });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.item);
}

async function answerQuestionWithContext(question, contextItems) {
    const { geminiKey, openaiKey } = getApiKey();
    
    if (!contextItems || !contextItems.length) {
        return {
            answer: "No relevant customer feedback was found in your workspace matching this query. Try searching for different terms like 'onboarding', 'checkout', or 'pricing'.",
            citedFeedback: []
        };
    }

    const formattedContext = contextItems.map((item, idx) => 
        `[Feedback #${idx + 1}] Channel: ${item.channel} | Sentiment: ${item.sentiment} | Feature: ${item.featureArea || "General"} | Content: "${item.content}"`
    ).join("\n\n");

    // 1. Google Gemini API Integration for Ask LOOP
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `You are Ask LOOP, an AI feedback intelligence assistant.
Your goal is to answer plain-English questions about customer feedback.

GROUNDING RULES:
1. Answer the question ONLY using the facts present in the provided Customer Feedback Context below.
2. DO NOT invent, assume, or extrapolate information that is not in the context.
3. If the context does not contain enough information to answer the question, clearly state that based on current customer feedback, the information is limited.
4. Reference specific feedback details (e.g. channel, feature, sentiment) to support your points.

Question: ${question}

Customer Feedback Context:
${formattedContext}`;

            const result = await model.generateContent(prompt);
            const answer = result.response.text().trim();
            if (answer) {
                return {
                    answer,
                    citedFeedback: contextItems
                };
            }
        } catch (geminiErr) {
            console.warn("Google Gemini API error in Ask LOOP, attempting fallback:", geminiErr.message);
        }
    }

    // 2. OpenAI API Integration for Ask LOOP
    if (openaiKey) {
        try {
            const client = new OpenAI({ apiKey: openaiKey });
            const modelName = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

            const response = await client.chat.completions.create({
                model: modelName,
                messages: [
                    {
                        role: "system",
                        content: `You are Ask LOOP, an AI feedback intelligence assistant. Answer strictly based on context.`
                    },
                    {
                        role: "user",
                        content: `Question: ${question}\n\nCustomer Feedback Context:\n${formattedContext}`
                    }
                ]
            });

            const answer = response.choices[0]?.message?.content?.trim() || "";
            if (answer) {
                return {
                    answer,
                    citedFeedback: contextItems
                };
            }
        } catch (openaiErr) {
            console.warn("OpenAI API error in Ask LOOP:", openaiErr.message);
        }
    }

    // 3. Heuristic Grounded Q&A Fallback Engine
    const totalFound = contextItems.length;
    const posCount = contextItems.filter(i => i.sentiment === "POS").length;
    const negCount = contextItems.filter(i => i.sentiment === "NEG").length;
    const neuCount = contextItems.filter(i => i.sentiment === "NEU").length;

    const featureAreas = [...new Set(contextItems.map(i => i.featureArea).filter(Boolean))];
    const topQuotes = contextItems.slice(0, 3).map(i => `"${i.content}" (${i.channel})`).join(" ");

    let sentimentSummary = "mixed";
    if (negCount > posCount && negCount > neuCount) sentimentSummary = "predominantly negative";
    else if (posCount > negCount && posCount > neuCount) sentimentSummary = "overwhelmingly positive";
    else if (neuCount > posCount && neuCount > negCount) sentimentSummary = "mostly neutral";

    const answer = `Based on ${totalFound} customer feedback records retrieved semantically, user sentiment regarding this topic is ${sentimentSummary} (${posCount} positive, ${negCount} negative, ${neuCount} neutral).\n\nKey feature areas touched include: ${featureAreas.join(", ") || "General"}.\n\nRepresentative verbatim quotes include: ${topQuotes}`;

    return {
        answer,
        citedFeedback: contextItems
    };
}

async function generateVoCNarrative(data) {
    const { fromDate, toDate, totalFeedback, positive, neutral, negative, topThemes, keyQuotes } = data;
    const { geminiKey, openaiKey } = getApiKey();

    const promptText = `You are a Chief Product Officer AI writing an executive Voice-of-Customer (VoC) Report for the period ${fromDate} to ${toDate}.

Feedback Statistics:
- Total Feedback Items: ${totalFeedback}
- Positive: ${positive} (${totalFeedback ? Math.round((positive / totalFeedback) * 100) : 0}%)
- Neutral: ${neutral} (${totalFeedback ? Math.round((neutral / totalFeedback) * 100) : 0}%)
- Negative: ${negative} (${totalFeedback ? Math.round((negative / totalFeedback) * 100) : 0}%)

Top Customer Feedback Themes (with Confidence Scores):
${topThemes.map(t => `- ${t.name}: ${t.count} items (${t.negative} negative, avg confidence: ${Math.round((t.avgConfidence || 0.9) * 100)}%)`).join("\n")}

Notable Customer Verbatim Quotes:
${keyQuotes.map(q => `"${q.content}" [${q.channel} - ${q.sentiment} - ${q.customerLabel || "Customer"}]`).join("\n")}

Generate a structured executive report JSON matching this exact structure:
{
    "executiveSummary": "2-3 sentence overview of customer sentiment and volume trends during this period.",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "themeAnalysis": "Detailed paragraph analyzing top themes and friction points.",
    "verbatimQuotes": ["Quote 1 with context", "Quote 2 with context"],
    "recommendations": ["Action item 1", "Action item 2", "Action item 3"]
}`;

    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
            const res = await model.generateContent(promptText);
            const text = res.response.text();
            const match = text.match(/\{[\s\S]*\}/);
            if (match) return JSON.parse(match[0]);
        } catch (e) {
            console.warn("Gemini VoC generation error:", e.message);
        }
    }

    if (openaiKey) {
        try {
            const client = new OpenAI({ apiKey: openaiKey });
            const res = await client.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptText }]
            });
            const text = res.choices[0]?.message?.content || "";
            const match = text.match(/\{[\s\S]*\}/);
            if (match) return JSON.parse(match[0]);
        } catch (e) {
            console.warn("OpenAI VoC generation error:", e.message);
        }
    }

    // Heuristic VoC Fallback
    return {
        executiveSummary: `During the period from ${fromDate} to ${toDate}, a total of ${totalFeedback} customer feedback entries were analyzed. Negative feedback accounts for ${totalFeedback ? Math.round((negative / totalFeedback) * 100) : 0}% of total volume.`,
        keyFindings: [
            `Top feedback volume concentrated in ${topThemes[0]?.name || "Checkout"}.`,
            `Overall customer sentiment scored ${positive > negative ? "predominantly positive" : "primarily negative"}.`,
            `Key user friction centers on latency and service stability.`
        ],
        themeAnalysis: `Analysis indicates that ${topThemes.slice(0, 3).map(t => t.name).join(", ")} generated the highest feedback activity. Immediate remediation is recommended for themes exhibiting elevated negative rates.`,
        verbatimQuotes: keyQuotes.slice(0, 3).map(q => `"${q.content}" — ${q.customerLabel || q.channel}`),
        recommendations: [
            `Investigate and resolve high-priority friction in ${topThemes[0]?.name || "Checkout"}.`,
            `Implement proactive automated notifications to manage customer expectations.`,
            `Schedule follow-up NPS outreach for unresolved support tickets.`
        ]
    };
}

module.exports = {
    analyzeFeedback,
    answerQuestionWithContext,
    generateEmbedding,
    computeCosineSimilarity,
    performVectorSearch,
    generateVoCNarrative,
    ALLOWED_SENTIMENTS,
    ALLOWED_FEATURE_AREAS
};
