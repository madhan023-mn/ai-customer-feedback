const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: [
                "THEME_RISK",
                "SENTIMENT_CHANGE",
                "VOLUME_SPIKE",
                "CHANNEL_RISK",
                "POSITIVE_TREND",
                "NEGATIVE_TREND"
            ],
            default: "THEME_RISK"
        },
        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM"
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM"
        },
        summary: {
            type: String,
            required: true,
            trim: true
        },
        theme: {
            type: String,
            default: null
        },
        recommendation: {
            type: String,
            required: true
        },
        evidence: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        status: {
            type: String,
            enum: ["ACTIVE", "RESOLVED", "DISMISSED"],
            default: "ACTIVE"
        },
        generatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Insight", insightSchema);

