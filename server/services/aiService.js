const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const { FEATURE_AREAS } = require("../constants/featureAreas");
const Feedback = require("../models/Feedback");

const ALLOWED_SENTIMENTS = ["POS", "NEU", "NEG"];
const ALLOWED_FEATURE_AREAS = [
    "Checkout",
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

function validateAIResult(result) {
    if (!result) {
        throw new Error("AI returned no result");
    }
    if (!ALLOWED_SENTIMENTS.includes(result.sentiment)) {
        throw new Error("Invalid AI sentiment");
    }
    if (typeof result.sentimentScore !== "number") {
        throw new Error("Invalid sentiment score");
    }
    if (result.sentimentScore < -1 || result.sentimentScore > 1) {
        throw new Error("Sentiment score must be between -1 and 1");
    }
    if (!ALLOWED_FEATURE_AREAS.includes(result.featureArea)) {
        throw new Error("Invalid feature area");
    }
    if (!result.rationale || typeof result.rationale !== "string") {
        throw new Error("AI rationale is required");
    }
    return true;
}

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
    "themes": ["Specific Problem or Topic Theme 1", "Theme 2"],
    "featureArea": string,
    "rationale": string
}

Allowed feature areas:
${FEATURE_AREAS.join("\n")}

Rules:
- sentiment must be POS, NEU, or NEG.
- sentimentScore must be between -1 and 1.
- themes MUST be an array of 1-3 specific, named problem or delight themes (e.g., ["Login Issues", "Auth Failure"], ["Payment Gateway Timeout"]).
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
                    ? parsed.themes.map(t => String(t).trim())
                    : [`${validFeature} Issues`];

                return {
                    sentiment: ["POS", "NEU", "NEG"].includes(parsed.sentiment) ? parsed.sentiment : "NEU",
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
                        content: `You are a customer feedback analysis system. Analyze the feedback and return ONLY valid JSON.
Required format:
{
    "sentiment": "POS" | "NEU" | "NEG",
    "sentimentScore": number between -1 and 1,
    "themes": ["Specific Theme 1", "Specific Theme 2"],
    "featureArea": string,
    "rationale": string
}

Allowed feature areas:
${FEATURE_AREAS.join("\n")}

Rules:
- sentiment must be POS, NEU, or NEG.
- sentimentScore must be between -1 and 1.
- themes MUST be an array of 1-3 specific named themes.
- featureArea MUST be one of the allowed feature areas listed above.
- rationale should briefly explain the classification.`
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
                    ? parsed.themes.map(t => String(t).trim())
                    : [`${validFeature} Issues`];

                return {
                    sentiment: ["POS", "NEU", "NEG"].includes(parsed.sentiment) ? parsed.sentiment : "NEU",
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
        themeMap.push("Checkout Problem", "Checkout Payment Failure");
    } else if (text.includes("dashboard") || text.includes("kpi") || text.includes("chart")) {
        featureArea = "Dashboard";
        themeMap.push("Dashboard Latency", "UI Refresh");
    } else if (text.includes("mobile") || text.includes("app") || text.includes("ios") || text.includes("android")) {
        featureArea = "Mobile";
        themeMap.push("Mobile Crash", "App Stability");
    } else if (text.includes("search") || text.includes("filter") || text.includes("find")) {
        featureArea = "Search";
        themeMap.push("Search Filter Speed", "Result Highlighting");
    } else if (text.includes("payment") || text.includes("card") || text.includes("stripe") || text.includes("billing")) {
        featureArea = "Payments";
        themeMap.push("Payment Failure", "Invoice Billing");
    } else if (text.includes("login") || text.includes("auth") || text.includes("password") || text.includes("signup") || text.includes("session")) {
        featureArea = "Authentication";
        themeMap.push("Login Issues", "Authentication Problems");
    } else if (text.includes("support") || text.includes("ticket") || text.includes("agent") || text.includes("help")) {
        featureArea = "Support";
        themeMap.push("Support Ticket Delay", "Customer Service SLA");
    } else if (text.includes("notification") || text.includes("alert") || text.includes("email")) {
        featureArea = "Notifications";
        themeMap.push("Notification Latency", "Email Verification");
    } else if (text.includes("speed") || text.includes("load") || text.includes("performance") || text.includes("latency") || text.includes("lag")) {
        featureArea = "Performance";
        themeMap.push("Performance Bottleneck", "System Latency");
    } else {
        themeMap.push("General Feedback");
    }

    return {
        sentiment,
        sentimentScore,
        themes: themeMap,
        featureArea,
        rationale
    };
}

async function generateInsight(param1, param2, param3) {
    let theme = "General";
    let analysisData = {};

    if (typeof param1 === "object" && param1 !== null) {
        analysisData = param1;
        theme = analysisData.theme || "General";
    } else {
        theme = param1;
        analysisData = {
            theme,
            totalFeedback: param2?.frequency || param2?.totalFeedback || 0,
            positive: param2?.positive || 0,
            neutral: param2?.neutral || 0,
            negative: param2?.negative || 0,
            negativePercentage: param2?.negativePercentage || 0,
            examples: param3 || []
        };
    }

    const { geminiKey, openaiKey } = getApiKey();

    // 1. Google Gemini API Integration
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `You are a product feedback intelligence AI system.
Analyze customer feedback statistics for theme: "${theme}".

GROUNDING & SAFETY RULES:
1. Use ONLY the supplied statistics.
2. Do not invent metrics or customer quotes.
3. Do not claim facts that are not supported by the provided evidence.
4. Return valid JSON only.

Required JSON format:
{
    "title": "short, actionable insight title",
    "summary": "clear 1-2 sentence summary explaining the evidence",
    "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "recommendation": "actionable step for product/engineering team"
}

Supplied Evidence / Statistics:
${JSON.stringify(analysisData, null, 2)}`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text();
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const allowedSeverity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
                const severity = allowedSeverity.includes(parsed.severity) ? parsed.severity : "HIGH";

                return {
                    title: parsed.title || `${theme} sentiment and feedback insight`,
                    summary: parsed.summary || `${theme} feedback has ${analysisData.negativePercentage || 0}% negative sentiment across ${analysisData.totalFeedback || 0} items.`,
                    severity,
                    priority: severity,
                    recommendation: parsed.recommendation || `Review recent ${theme} complaints and investigate recurring issues.`
                };
            }
        } catch (geminiErr) {
            console.warn("Google Gemini API error generating insight, attempting fallback:", geminiErr.message);
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
                        content: `You are a product feedback intelligence analyst. Use ONLY supplied statistics. Return valid JSON with keys: title, summary, severity (LOW|MEDIUM|HIGH|CRITICAL), recommendation.`
                    },
                    {
                        role: "user",
                        content: `Analyze theme stats:\n${JSON.stringify(analysisData, null, 2)}`
                    }
                ]
            });

            const textResponse = response.choices[0]?.message?.content || "";
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const allowedSeverity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
                const severity = allowedSeverity.includes(parsed.severity) ? parsed.severity : "HIGH";

                return {
                    title: parsed.title || `${theme} sentiment pattern`,
                    summary: parsed.summary || `${theme} has ${analysisData.negativePercentage || 0}% negative feedback.`,
                    severity,
                    priority: severity,
                    recommendation: parsed.recommendation || `Optimize ${theme} workflows.`
                };
            }
        } catch (openaiErr) {
            console.warn("OpenAI API error generating insight:", openaiErr.message);
        }
    }

    // 3. Heuristic Safe Fallback Engine
    const negRate = Number(analysisData.negativePercentage || 0);
    let severity = "MEDIUM";
    if (negRate >= 70) severity = "HIGH";
    if (negRate >= 85) severity = "CRITICAL";
    else if (negRate < 30) severity = "LOW";

    const title = `${theme} sentiment is highly negative`;
    const summary = `${theme} has received ${analysisData.totalFeedback || 0} feedback records, with ${negRate.toFixed(1)}% classified as negative.`;
    const recommendation = `Review recent ${theme} complaints and identify recurring failure points.`;

    return {
        title,
        summary,
        severity,
        priority: severity,
        recommendation
    };
}

async function answerQuestionWithContext(question, contextItems) {
    const { geminiKey, openaiKey } = getApiKey();
    
    if (!contextItems || !contextItems.length) {
        return {
            answer: "No relevant customer feedback was found in your workspace matching this query. Try searching for different feature terms like 'onboarding', 'checkout', or 'pricing'.",
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

    const answer = `Based on ${totalFound} customer feedback records matching your query, user sentiment regarding this topic is ${sentimentSummary} (${posCount} positive, ${negCount} negative, ${neuCount} neutral).\n\nKey feature areas touched include: ${featureAreas.join(", ") || "General"}.\n\nNotable customer statements include: ${topQuotes}`;

    return {
        answer,
        citedFeedback: contextItems
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
            console.warn("OpenAI embedding API failed, using vector fallback:", err.message);
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
    const feedbackList = await Feedback.find({
        workspace: workspaceId
    }).select("content channel sentiment sentimentScore featureArea themes customerLabel createdAt embedding");

    const scored = feedbackList.map((item) => {
        const itemVector = (Array.isArray(item.embedding) && item.embedding.length > 0)
            ? item.embedding
            : generateLocalVector(item.content);

        const score = computeCosineSimilarity(questionVector, itemVector);
        return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.item);
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

Top Customer Feedback Themes:
${topThemes.map(t => `- ${t.name}: ${t.count} items (${t.negative} negative)`).join("\n")}

Notable Customer Quotes:
${keyQuotes.map(q => `"${q.content}" [${q.channel} - ${q.sentiment}]`).join("\n")}

Generate a structured executive report JSON with:
{
    "executiveSummary": "2-3 sentence overview of customer sentiment and volume trends during this period.",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "themeAnalysis": "Detailed paragraph analyzing top themes and friction points.",
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
            `Top feature area volume was concentrated in ${topThemes[0]?.name || "Checkout"}.`,
            `Overall customer sentiment scored ${positive > negative ? "predominantly positive" : "primarily negative"}.`,
            `Key user friction centers on latency and service stability.`
        ],
        themeAnalysis: `Analysis indicates that ${topThemes.slice(0, 3).map(t => t.name).join(", ")} generated the highest feedback activity. Immediate remediation is recommended for themes exhibiting elevated negative rates.`,
        recommendations: [
            `Investigate and resolve high-priority friction in ${topThemes[0]?.name || "Checkout"}.`,
            `Implement proactive automated notifications to manage customer expectations.`,
            `Schedule follow-up NPS outreach for unresolved support tickets.`
        ]
    };
}

module.exports = {
    analyzeFeedback,
    generateInsight,
    answerQuestionWithContext,
    generateEmbedding,
    computeCosineSimilarity,
    performVectorSearch,
    generateVoCNarrative,
    validateAIResult,
    ALLOWED_SENTIMENTS,
    ALLOWED_FEATURE_AREAS
};
