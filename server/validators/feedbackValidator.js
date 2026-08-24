const { z } = require("zod");

const feedbackSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Feedback content is required")
        .max(
            5000,
            "Feedback cannot exceed 5000 characters"
        ),

    channel: z.enum([
        "SUPPORT_TICKET",
        "APP_STORE",
        "NPS_SURVEY",
        "SALES_CALL",
        "COMMUNITY"
    ]),

    customerLabel: z
        .string()
        .trim()
        .max(200)
        .optional(),

    featureArea: z
        .string()
        .trim()
        .max(200)
        .optional(),

    sentiment: z
        .enum(["POS", "NEU", "NEG"])
        .optional(),

    sentimentScore: z
        .number()
        .min(-1)
        .max(1)
        .optional(),

    status: z
        .enum(["NEW", "REVIEWED", "ACTIONED", "RESOLVED", "ARCHIVED"])
        .optional(),

    rationale: z
        .string()
        .trim()
        .max(2000)
        .optional()
});

module.exports = feedbackSchema;