const feedbackQueue = require("./feedbackQueue");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

async function queueFeedbackAnalysis(feedbackId) {
    try {
        const job = await feedbackQueue.add(
            "analyze-feedback",
            {
                feedbackId: feedbackId.toString()
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000
                },
                removeOnComplete: 100,
                removeOnFail: 100
            }
        );
        return job;
    } catch (err) {
        // Fallback: execute processing synchronously if Redis is offline
        processPendingFeedback(5).catch(() => {});
        return null;
    }
}

async function queueFeedbackAnalysisBulk(feedbackIds) {
    try {
        const jobs = feedbackIds.map(feedbackId => ({
            name: "analyze-feedback",
            data: {
                feedbackId: feedbackId.toString()
            },
            opts: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000
                },
                removeOnComplete: 100,
                removeOnFail: 100
            }
        }));

        return await feedbackQueue.addBulk(jobs);
    } catch (err) {
        // Fallback: execute bulk processing synchronously if Redis is offline
        processPendingFeedback(20).catch(() => {});
        return null;
    }
}

module.exports = {
    queueFeedbackAnalysis,
    queueFeedbackAnalysisBulk
};
