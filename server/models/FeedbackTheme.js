const mongoose = require("mongoose");

const feedbackThemeSchema = new mongoose.Schema(
    {
        feedback: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedback",
            required: true,
            index: true
        },

        theme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theme",
            required: true,
            index: true
        },

        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
            default: 0.85
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

feedbackThemeSchema.index({ workspace: 1, feedback: 1, theme: 1 }, { unique: true });

module.exports = mongoose.model("FeedbackTheme", feedbackThemeSchema);
