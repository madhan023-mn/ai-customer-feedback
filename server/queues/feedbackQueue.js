const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const feedbackQueue = new Queue("feedback-ai", {
    connection: redisConnection
});

module.exports = feedbackQueue;
