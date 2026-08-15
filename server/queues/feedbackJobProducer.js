const feedbackQueue = require("./feedbackQueue");

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
        console.warn("Failed to add job to BullMQ queue:", err.message);
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
        console.warn("Failed to add bulk jobs to BullMQ queue:", err.message);
        return null;
    }
}

module.exports = {
    queueFeedbackAnalysis,
    queueFeedbackAnalysisBulk
};
