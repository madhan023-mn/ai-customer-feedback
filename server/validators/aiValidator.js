const { z } = require("zod");
const { FEATURE_AREAS } = require("../constants/featureAreas");

const aiResultSchema = z.object({
    sentiment: z.enum(["POS", "NEU", "NEG"]).default("NEU"),
    sentimentScore: z.number().min(-1).max(1).default(0),
    featureArea: z.enum(FEATURE_AREAS).default("Other"),
    rationale: z.string().trim().min(1).max(1000).default("Automated AI feedback classification.")
});

module.exports = aiResultSchema;
