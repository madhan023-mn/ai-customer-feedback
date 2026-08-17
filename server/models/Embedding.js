const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema(
    {
        feedback: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedback",
            required: true,
            unique: true,
            index: true
        },

        vector: {
            type: [Number],
            required: true,
            default: []
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

module.exports = mongoose.model("Embedding", embeddingSchema);
