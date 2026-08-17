require("dotenv").config();
const Redis = require("ioredis");

let isRedisConnected = false;
let hasWarnedOffline = false;

const redisConnection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    showFriendlyErrorStack: false,
    retryStrategy(times) {
        if (times > 2) {
            if (!hasWarnedOffline) {
                console.log("ℹ️ Local Redis is offline (127.0.0.1:6379). Queue tasks will use automatic in-memory fallback.");
                hasWarnedOffline = true;
            }
            return null; // Stop retrying once offline
        }
        return 1000;
    }
});

// Suppress unhandled error events when Redis is offline
redisConnection.on("error", (error) => {
    if (isRedisConnected) {
        console.warn("Redis connection issue:", error.message);
    } else if (!hasWarnedOffline) {
        console.log("ℹ️ Local Redis is offline (127.0.0.1:6379). App is running smoothly with automatic fallback.");
        hasWarnedOffline = true;
    }
});

redisConnection.on("connect", () => {
    isRedisConnected = true;
    hasWarnedOffline = false;
    console.log("⚡ Redis connected successfully!");
});

module.exports = redisConnection;
