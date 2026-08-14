const Feedback = require("../models/Feedback");
const Insight = require("../models/Insight");
const { generateInsight } = require("../services/aiService");
const insightSchema = require("../validators/insightValidator");
const calculateTrend = require("../utils/calculateTrend");

async function generateThemeInsight(req, res) {
    try {
        const theme = decodeURIComponent(req.params.theme);
        const workspace = req.user.workspace;

        const allFeedback = await Feedback.find({
            workspace,
            featureArea: theme
        }).sort({ createdAt: -1 });

        if (!allFeedback.length) {
            return res.status(404).json({
                message: "No feedback found for this theme"
            });
        }

        const positive = allFeedback.filter(item => item.sentiment === "POS").length;
        const neutral = allFeedback.filter(item => item.sentiment === "NEU").length;
        const negative = allFeedback.filter(item => item.sentiment === "NEG").length;
        const frequency = allFeedback.length;
        const negativePercentage = (negative / frequency) * 100;

        const trend = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    featureArea: theme
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const trendDirection = calculateTrend(trend);
        const examples = allFeedback.slice(0, 5).map(item => item.content);

        const statistics = {
            frequency,
            positive,
            neutral,
            negative,
            negativePercentage,
            trendDirection
        };

        const aiResult = await generateInsight(theme, statistics, examples);
        const validation = insightSchema.safeParse(aiResult);

        if (!validation.success) {
            return res.status(502).json({
                message: "AI returned invalid insight data"
            });
        }

        const insight = await Insight.create({
            workspace,
            theme,
            title: validation.data.title,
            summary: validation.data.summary,
            recommendation: validation.data.recommendation,
            priority: validation.data.priority
        });

        res.status(201).json({
            message: "Insight generated successfully",
            insight
        });
    } catch (error) {
        console.error("Insight generation error:", error);
        res.status(500).json({
            message: "Failed to generate insight"
        });
    }
}

async function getInsights(req, res) {
    try {
        const insights = await Insight.find({
            workspace: req.user.workspace
        }).sort({ createdAt: -1 });

        res.json({
            insights
        });
    } catch (error) {
        console.error("Get insights error:", error);
        res.status(500).json({
            message: "Failed to load insights"
        });
    }
}

module.exports = {
    generateThemeInsight,
    getInsights
};
