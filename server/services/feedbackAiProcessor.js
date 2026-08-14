const Feedback = require("../models/Feedback");
const { analyzeFeedback, validateAIResult } = require("./aiService");

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
        // Record might already be processing or completed
        return null;
    }

    try {
        const result = await analyzeFeedback(claimed.content);
        validateAIResult(result);

        const updated = await Feedback.findOneAndUpdate(
            {
                _id: claimed._id,
                aiStatus: "PROCESSING"
            },
            {
                $set: {
                    sentiment: result.sentiment,
                    sentimentScore: result.sentimentScore,
                    featureArea: result.featureArea,
                    rationale: result.rationale,
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
    processFeedback: processSingleFeedback // Alias for backward compatibility
};
