require("dotenv").config();
const connectDB = require("../config/db");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

async function startWorker() {
    try {
        await connectDB();
        console.log("🤖 AI Background Worker connected to MongoDB");

        while (true) {
            const stats = await processPendingFeedback(10);
            if (stats && stats.processed > 0) {
                console.log(`[AI Worker Cycle] Processed ${stats.processed} feedback items (${stats.successful} succeeded, ${stats.failed} failed)`);
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error("AI Worker fatal error:", error);
        process.exit(1);
    }
}

startWorker();
