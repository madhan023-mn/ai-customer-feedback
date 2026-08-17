const Feedback = require("../models/Feedback");
const Theme = require("../models/Theme");
const FeedbackTheme = require("../models/FeedbackTheme");
const Embedding = require("../models/Embedding");
const { analyzeFeedback, generateEmbedding } = require("./aiService");

async function claimFeedback(feedbackId) {
    return Feedback.findOneAndUpdate(
        {
            _id: feedbackId,
            aiStatus: { $in: ["PENDING", "FAILED"] }
        },
        {
            $set: {
                aiStatus: "PROCESSING"
            }
        },
        {
            new: true
        }
    );
}

async function processSingleFeedback(feedbackOrId) {
    const feedbackId = typeof feedbackOrId === "object" ? feedbackOrId._id : feedbackOrId;

    const claimed = await claimFeedback(feedbackId);
    if (!claimed) {
        return null;
    }

    try {
        const result = await analyzeFeedback(claimed.content);

        const extractedThemeNames = [];
        const themePairs = Array.isArray(result.themes) ? result.themes : [];

        // Save FeedbackTheme join records & Theme entities
        for (const item of themePairs) {
            const themeName = typeof item === "object" && item.name ? item.name : String(item);
            const confidence = typeof item === "object" && typeof item.confidence === "number" ? item.confidence : 0.88;

            extractedThemeNames.push(themeName);

            // Find or create Theme entity
            let themeDoc = await Theme.findOne({
                workspace: claimed.workspace,
                name: themeName
            });

            if (!themeDoc) {
                themeDoc = await Theme.create({
                    name: themeName,
                    description: `${claimed.featureArea || "General"} feedback theme cluster`,
                    color: "#6d5dfc",
                    workspace: claimed.workspace
                });
            }

            // Create FeedbackTheme join entry
            await FeedbackTheme.findOneAndUpdate(
                {
                    feedback: claimed._id,
                    theme: themeDoc._id
                },
                {
                    $set: {
                        confidence,
                        workspace: claimed.workspace
                    }
                },
                { upsert: true, new: true }
            );
        }

        // Generate and persist Embedding vector
        const vector = await generateEmbedding(claimed.content);
        await Embedding.findOneAndUpdate(
            { feedback: claimed._id },
            {
                $set: {
                    vector,
                    workspace: claimed.workspace
                }
            },
            { upsert: true, new: true }
        );

        const updated = await Feedback.findOneAndUpdate(
            {
                _id: claimed._id,
                aiStatus: "PROCESSING"
            },
            {
                $set: {
                    sentiment: result.sentiment,
                    sentimentScore: result.sentimentScore,
                    themes: extractedThemeNames.length > 0 ? extractedThemeNames : [result.featureArea],
                    featureArea: result.featureArea,
                    rationale: result.rationale,
                    embedding: vector,
                    aiStatus: "COMPLETED",
                    analyzedAt: new Date(),
                    aiError: null
                }
            },
            {
                new: true
            }
        );

        return updated;
    } catch (error) {
        console.error(`AI processing error for feedback ${claimed._id}:`, error.message);

        await Feedback.findOneAndUpdate(
            {
                _id: claimed._id,
                aiStatus: "PROCESSING"
            },
            {
                $set: {
                    aiStatus: "FAILED",
                    aiError: error.message || "AI processing failed"
                }
            }
        );

        throw error;
    }
}

async function processPendingFeedback(limit = 10, workspaceId = null) {
    const query = { aiStatus: "PENDING" };
    if (workspaceId) {
        query.workspace = workspaceId;
    }

    const feedbackItems = await Feedback.find(query)
        .sort({ createdAt: 1 })
        .limit(limit);

    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (const feedback of feedbackItems) {
        try {
            const res = await processSingleFeedback(feedback._id);
            if (res) {
                processed++;
                successful++;
            }
        } catch (error) {
            processed++;
            failed++;
        }
    }

    return {
        processed,
        successful,
        failed
    };
}

module.exports = {
    claimFeedback,
    processSingleFeedback,
    processPendingFeedback,
    processFeedback: processSingleFeedback
};
