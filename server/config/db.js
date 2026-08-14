const mongoose = require("mongoose");

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loop";
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

module.exports = connectDB;