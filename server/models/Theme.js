const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String
        },

        color: {
            type: String,
            default: "#6d5dfc"
        },

        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        }
    },
    {
        timestamps: true
    }
);

themeSchema.index(
    {
        workspace: 1,
        name: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Theme",
    themeSchema
);