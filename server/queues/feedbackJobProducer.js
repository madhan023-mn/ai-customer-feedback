const feedbackQueue = require("./feedbackQueue");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

async function queueFeedbackAnalysis(feedbackId) {
    try {
        if (!feedbackId) return null;
        const idStr = String(feedbackId);
        const job = await feedbackQueue.add(
            "analyze-feedback",
            {
                feedbackId: idStr
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
        processPendingFeedback(5).catch(() => {});
        return null;
    }
}

async function queueFeedbackAnalysisBulk(feedbackIds) {
    try {
        if (!Array.isArray(feedbackIds) || feedbackIds.length === 0) return null;
        const jobs = feedbackIds
            .filter(id => id != null)
            .map(feedbackId => ({
                name: "analyze-feedback",
                data: {
                    feedbackId: String(feedbackId)
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
        processPendingFeedback(20).catch(() => {});
        return null;
    }
}

module.exports = {
    queueFeedbackAnalysis,
    queueFeedbackAnalysisBulk
};
