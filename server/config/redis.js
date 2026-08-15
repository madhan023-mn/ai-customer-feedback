require("dotenv").config();
const Redis = require("ioredis");

let isRedisConnected = false;

const redisConnection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    retryStrategy(times) {
        if (times > 3) {
            return null; // Stop retrying if Redis server is offline locally
        }
        return Math.min(times * 500, 2000);
    }
});

redisConnection.on("connect", () => {
    isRedisConnected = true;
    console.log("⚡ Redis connected successfully!");
});

redisConnection.on("error", (error) => {
    if (isRedisConnected) {
        console.warn("Redis connection issue:", error.message);
    }
});

module.exports = redisConnection;
