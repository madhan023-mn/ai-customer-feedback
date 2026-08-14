const Feedback = require("../models/Feedback");
const { analyzeFeedback } = require("./aiService");
const aiResultSchema = require("../validators/aiValidator");

async function processFeedback(feedbackId, workspace) {
    const feedback = await Feedback.findOne({
        _id: feedbackId,
        workspace
    });

    if (!feedback) {
        throw new Error("Feedback not found");
    }

    if (feedback.aiStatus === "PROCESSING") {
        throw new Error("Feedback is already being processed");
    }

    feedback.aiStatus = "PROCESSING";
    await feedback.save();

    try {
        const result = await analyzeFeedback(feedback.content);
        const validation = aiResultSchema.safeParse(result);

        if (!validation.success) {
            feedback.aiStatus = "FAILED";
            await feedback.save();
            throw new Error("AI returned invalid data");
        }

        feedback.sentiment = validation.data.sentiment;
        feedback.sentimentScore = validation.data.sentimentScore;
        feedback.featureArea = validation.data.featureArea;
        feedback.rationale = validation.data.rationale;
        feedback.aiStatus = "COMPLETED";

        await feedback.save();
        return feedback;
    } catch (error) {
        feedback.aiStatus = "FAILED";
        await feedback.save();
        throw error;
    }
}

module.exports = {
    processFeedback
};
