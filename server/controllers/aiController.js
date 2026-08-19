const Feedback = require("../models/Feedback");
const { processSingleFeedback } = require("../services/feedbackAiProcessor");
const { answerQuestionWithContext, performVectorSearch } = require("../services/aiService");

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

        const result = await processSingleFeedback(feedback._id, true);

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
        const requestedLimit = Number(req.body?.limit);
        const query = Feedback.find({
            workspace: req.user.workspace,
            aiStatus: "PENDING"
        }).sort({ createdAt: 1 });

        if (requestedLimit && requestedLimit > 0) {
            query.limit(requestedLimit);
        }

        const pending = await query.exec();

        if (!pending.length) {
            return res.json({
                message: "No pending feedback found. All feedback has been analyzed!",
                processed: 0,
                successful: 0,
                failed: 0,
                remainingPending: 0
            });
        }

        let successful = 0;
        let failed = 0;

        for (const feedback of pending) {
            try {
                const updated = await processSingleFeedback(feedback._id, true);
                if (updated) {
                    successful++;
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`Failed to analyze ${feedback._id}:`, error.message);
                failed++;
            }
        }

        const remainingPending = await Feedback.countDocuments({
            workspace: req.user.workspace,
            aiStatus: "PENDING"
        });

        res.json({
            message: `Processed ${pending.length} feedback. ${successful} successful, ${failed} failed.`,
            processed: pending.length,
            successful,
            failed,
            remainingPending
        });
    } catch (error) {
        console.error("Batch analysis error:", error);
        res.status(500).json({
            message: error.message || "Batch analysis failed"
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