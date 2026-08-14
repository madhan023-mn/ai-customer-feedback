const { z } = require("zod");

const insightSchema = z.object({
    title: z.string().trim().min(1).max(200),
    summary: z.string().trim().min(1).max(1000),
    recommendation: z.string().trim().min(1).max(1000),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM")
});

module.exports = insightSchema;
