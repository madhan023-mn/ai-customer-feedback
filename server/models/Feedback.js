const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },

        channel: {
            type: String,
            required: true,
            default: "SUPPORT_TICKET"
        },

        sourceRef: {
            type: String,
            trim: true,
            default: null
        },

        customerLabel: {
            type: String,
            trim: true
        },

        aiStatus: {
            type: String,
            enum: [
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "FAILED"
            ],
            default: "PENDING"
        },

        sentiment: {
            type: String,
            enum: ["POS", "NEU", "NEG"],
            default: "NEU"
        },

        sentimentScore: {
            type: Number,
            min: -1,
            max: 1,
            default: 0
        },

        featureArea: {
            type: String,
            trim: true
        },

        themes: [
            {
                type: String,
                trim: true
            }
        ],

        embedding: {
            type: [Number],
            default: []
        },

        rationale: {
            type: String,
            trim: true
        },

        aiError: {
            type: String,
            default: null
        },

        analyzedAt: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: [
                "NEW",
                "REVIEWED",
                "ACTIONED",
                "RESOLVED",
                "ARCHIVED"
            ],
            default: "NEW"
        },

        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

feedbackSchema.index({
    workspace: 1,
    createdAt: -1
});

feedbackSchema.index({
    workspace: 1,
    status: 1
});

feedbackSchema.index({
    workspace: 1,
    aiStatus: 1
});

feedbackSchema.index({
    workspace: 1,
    channel: 1
});

feedbackSchema.index({
    workspace: 1,
    sentiment: 1
});

feedbackSchema.index({
    workspace: 1,
    featureArea: 1
});

module.exports = mongoose.model(
    "Feedback",
    feedbackSchema
);