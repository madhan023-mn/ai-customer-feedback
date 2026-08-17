const mongoose = require("mongoose");

let cachedPromise = null;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    if (!cachedPromise) {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loop_db";
        cachedPromise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 8000
        }).then((m) => {
            console.log("MongoDB connected successfully");
            return m;
        }).catch((err) => {
            cachedPromise = null;
            console.error("MongoDB connection failed:", err.message);
            throw err;
        });
    }

    return cachedPromise;
}

module.exports = connectDB;