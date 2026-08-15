require("dotenv").config();
const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const connectDB = require("../config/db");
const Feedback = require("../models/Feedback");
const { analyzeFeedback } = require("../services/aiService");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

async function startWorker() {
    try {
        await connectDB();
        console.log("🤖 AI Background Worker connected to MongoDB");

        const worker = new Worker(
            "feedback-ai",
            async (job) => {
                console.log(`Processing job ${job.id}`);
                const { feedbackId } = job.data;

                const feedback = await Feedback.findById(feedbackId);
                if (!feedback) {
                    throw new Error("Feedback not found");
                }

                await job.updateProgress(25);

                feedback.aiStatus = "PROCESSING";
                feedback.aiError = null;
                await feedback.save();

                try {
                    const result = await analyzeFeedback(feedback);
                    await job.updateProgress(75);

                    feedback.sentiment = result.sentiment;
                    feedback.sentimentScore = result.sentimentScore;
                    feedback.themes = Array.isArray(result.themes) ? result.themes : [result.featureArea];
                    feedback.featureArea = result.featureArea;
                    feedback.rationale = result.rationale;
                    feedback.aiStatus = "COMPLETED";
                    feedback.aiError = null;
                    feedback.analyzedAt = new Date();

                    await feedback.save();
                    await job.updateProgress(100);

                    return {
                        feedbackId,
                        status: "COMPLETED"
                    };
                } catch (error) {
                    feedback.aiStatus = "FAILED";
                    feedback.aiError = error.message;
                    await feedback.save();
                    throw error;
                }
            },
            {
                connection: redisConnection,
                concurrency: 2
            }
        );

        worker.on("completed", (job) => {
            console.log(`Job ${job.id} completed`);
        });

        worker.on("failed", (job, error) => {
            console.error(`Job ${job?.id} failed:`, error?.message || error);
        });

        worker.on("error", (error) => {
            console.error("Worker error:", error.message || error);
        });

        console.log("BullMQ AI worker started with concurrency = 2");

        // Fallback polling loop to process any pending items if Redis is offline or missed
        setInterval(async () => {
            try {
                await processPendingFeedback(5);
            } catch (err) {
                // Ignore fallback polling error
            }
        }, 10000);

    } catch (error) {
        console.error("AI Worker fatal error:", error);
    }
}

startWorker();
