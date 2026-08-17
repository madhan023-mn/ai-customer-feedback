const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const feedbackQueue = new Queue("feedback-ai", {
    connection: redisConnection
});

// Quietly swallow queue connection errors if local Redis is offline
feedbackQueue.on("error", () => {
    // Handled by redisConnection error listener
});

module.exports = feedbackQueue;
