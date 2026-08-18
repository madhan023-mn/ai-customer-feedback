const Feedback = require("../models/Feedback");
const { processFeedback } = require("../services/feedbackAiProcessor");
const { answerQuestionWithContext, performVectorSearch } = require("../services/aiService");

const MAX_BATCH_SIZE = 10;

async function analyzeSingleFeedback(req, res) {
    try {
        const feedback = await Feedback.findOne({
            _id: req.params.id,
            workspace: req.user.workspace
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        const result = await processFeedback(feedback._id, req.user.workspace);

        res.json({
            message: "Feedback analyzed successfully",
            feedback: result
        });
    } catch (error) {
        console.error("AI analysis error:", error);
        res.status(502).json({
            message: error.message || "AI analysis failed"
        });
    }
}

async function analyzePendingFeedback(req, res) {
    try {
        const limit = Math.min(
            Number(req.body?.limit) || 10,
            MAX_BATCH_SIZE
        );

        const pending = await Feedback.find({
            workspace: req.user.workspace,
            aiStatus: "PENDING"
        })
        .sort({ createdAt: 1 })
        .limit(limit);

        if (!pending.length) {
            return res.json({
                message: "No pending feedback found",
                processed: 0,
                successful: 0,
                failed: 0
            });
        }

        let successful = 0;
        let failed = 0;

        for (const feedback of pending) {
            try {
                await processFeedback(feedback._id, req.user.workspace);
                successful++;
            } catch (error) {
                console.error(`Failed to analyze ${feedback._id}:`, error.message);
                failed++;
            }
        }

        res.json({
            message: "Batch analysis completed",
            processed: pending.length,
            successful,
            failed
        });
    } catch (error) {
        console.error("Batch analysis error:", error);
        res.status(500).json({
            message: "Batch analysis failed"
        });
    }
}

async function retryFailedFeedback(req, res) {
    try {
        const feedback = await Feedback.findOne({
            _id: req.params.id,
            workspace: req.user.workspace,
            aiStatus: "FAILED"
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Failed feedback not found"
            });
        }

        feedback.aiStatus = "PENDING";
        await feedback.save();

        res.json({
            message: "Feedback queued for retry",
            feedback
        });
    } catch (error) {
        console.error("Retry feedback error:", error);
        res.status(500).json({
            message: "Failed to retry feedback"
        });
    }
}

async function askLoop(req, res) {
    try {
        const { question } = req.body;
        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const workspace = req.user.workspace;

        // Perform semantic vector retrieval (Top-K = 7)
        const vectorMatches = await performVectorSearch(workspace, question.trim(), 7);

        let contextItems = vectorMatches || [];

        // Fallback to top recent feedback only if no relevant matches found
        if (contextItems.length === 0) {
            contextItems = await Feedback.find({ workspace })
                .sort({ createdAt: -1 })
                .limit(7)
                .lean();
        }

        const result = await answerQuestionWithContext(question.trim(), contextItems);

        res.json({
            question: question.trim(),
            answer: result.answer,
            citedFeedback: result.citedFeedback
        });
    } catch (error) {
        console.error("Ask LOOP error:", error);
        res.status(500).json({
            message: "Failed to answer question"
        });
    }
}

module.exports = {
    analyzeSingleFeedback,
    analyzePendingFeedback,
    retryFailedFeedback,
    askLoop
};