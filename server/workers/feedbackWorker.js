require("dotenv").config();
const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const connectDB = require("../config/db");
const Feedback = require("../models/Feedback");
const { analyzeFeedback } = require("../services/aiService");
const { processPendingFeedback, processSingleFeedback } = require("../services/feedbackAiProcessor");

async function startWorker() {
    try {
        await connectDB();
        console.log("🤖 AI Background Worker connected to MongoDB");

        const worker = new Worker(
            "feedback-ai",
            async (job) => {
                console.log(`Processing job ${job.id}`);
                const { feedbackId } = job.data;

                if (!feedbackId) {
                    throw new Error("Missing feedbackId in job payload");
                }

                await job.updateProgress(25);
                const updated = await processSingleFeedback(feedbackId, true);
                await job.updateProgress(100);

                return {
                    feedbackId,
                    status: updated ? "COMPLETED" : "SKIPPED"
                };
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
