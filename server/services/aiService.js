const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const { FEATURE_AREAS } = require("../constants/featureAreas");

function getApiKey() {
    return {
        geminiKey: (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || "").trim(),
        openaiKey: (process.env.OPENAI_API_KEY || "").trim()
    };
}

async function analyzeFeedback(content) {
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
    "featureArea": string,
    "rationale": string
}

Allowed feature areas:
${FEATURE_AREAS.join("\n")}

Rules:
- sentiment must be POS, NEU, or NEG.
- sentimentScore must be between -1 and 1.
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
                return {
                    sentiment: ["POS", "NEU", "NEG"].includes(parsed.sentiment) ? parsed.sentiment : "NEU",
                    sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 0,
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
    "featureArea": string,
    "rationale": string
}

Allowed feature areas:
${FEATURE_AREAS.join("\n")}

Rules:
- sentiment must be POS, NEU, or NEG.
- sentimentScore must be between -1 and 1.
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
                return {
                    sentiment: ["POS", "NEU", "NEG"].includes(parsed.sentiment) ? parsed.sentiment : "NEU",
                    sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 0,
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

    if (text.includes("checkout") || text.includes("cart") || text.includes("buy")) {
        featureArea = "Checkout";
    } else if (text.includes("dashboard") || text.includes("kpi") || text.includes("chart")) {
        featureArea = "Dashboard";
    } else if (text.includes("mobile") || text.includes("app") || text.includes("ios") || text.includes("android")) {
        featureArea = "Mobile";
    } else if (text.includes("search") || text.includes("filter") || text.includes("find")) {
        featureArea = "Search";
    } else if (text.includes("payment") || text.includes("card") || text.includes("stripe") || text.includes("billing")) {
        featureArea = "Payments";
    } else if (text.includes("login") || text.includes("auth") || text.includes("password") || text.includes("signup") || text.includes("session")) {
        featureArea = "Authentication";
    } else if (text.includes("support") || text.includes("ticket") || text.includes("agent") || text.includes("help")) {
        featureArea = "Support";
    } else if (text.includes("notification") || text.includes("alert") || text.includes("email")) {
        featureArea = "Notifications";
    } else if (text.includes("speed") || text.includes("load") || text.includes("performance") || text.includes("latency") || text.includes("lag")) {
        featureArea = "Performance";
    }

    return {
        sentiment,
        sentimentScore,
        featureArea,
        rationale
    };
}

async function generateInsight(theme, statistics, examples) {
    const { geminiKey, openaiKey } = getApiKey();

    // 1. Google Gemini API Integration
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `You are a product feedback intelligence analyst.
Analyze the supplied theme statistics and customer feedback examples for theme: "${theme}".
Return ONLY a single JSON object.

Required format:
{
    "title": "short insight title",
    "summary": "clear explanation",
    "recommendation": "action the product team should take",
    "priority": "LOW" | "MEDIUM" | "HIGH"
}

Theme Data:
${JSON.stringify({ theme, statistics, examples })}`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text();
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    title: parsed.title || `${theme} performance and user feedback pattern`,
                    summary: parsed.summary || `Analysis of ${statistics.frequency} feedback entries for ${theme}.`,
                    recommendation: parsed.recommendation || `Review and optimize ${theme} workflows.`,
                    priority: ["LOW", "MEDIUM", "HIGH"].includes(parsed.priority) ? parsed.priority : "MEDIUM"
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
                        content: `You are a product feedback intelligence analyst. Return ONLY valid JSON.`
                    },
                    {
                        role: "user",
                        content: JSON.stringify({ theme, statistics, examples })
                    }
                ]
            });

            const textResponse = response.choices[0]?.message?.content || "";
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    title: parsed.title || `${theme} performance pattern`,
                    summary: parsed.summary || `Analysis of ${statistics.frequency} feedback entries for ${theme}.`,
                    recommendation: parsed.recommendation || `Optimize ${theme} workflow.`,
                    priority: ["LOW", "MEDIUM", "HIGH"].includes(parsed.priority) ? parsed.priority : "MEDIUM"
                };
            }
        } catch (openaiErr) {
            console.warn("OpenAI API error generating insight:", openaiErr.message);
        }
    }

    // 3. Heuristic Fallback
    const negRate = statistics?.negativePercentage || 0;
    let priority = "MEDIUM";
    if (negRate > 50) priority = "HIGH";
    else if (negRate < 20) priority = "LOW";

    const title = `${theme} customer friction and feedback insights`;
    const summary = `Customers have submitted ${statistics?.frequency || 0} feedback items for ${theme}. The negative sentiment ratio is ${Number(negRate).toFixed(1)}% with an overall trend of ${statistics?.trendDirection || "STABLE"}.`;
    const recommendation = negRate > 50
        ? `Prioritize immediate technical and UX investigation into ${theme} to address high negative sentiment.`
        : `Monitor ${theme} user feedback and maintain current system reliability.`;

    return {
        title,
        summary,
        recommendation,
        priority
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

module.exports = {
    analyzeFeedback,
    generateInsight,
    answerQuestionWithContext
};


