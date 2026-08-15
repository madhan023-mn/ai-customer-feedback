const Feedback = require("../models/Feedback");
const Insight = require("../models/Insight");
const { generateInsight } = require("../services/aiService");
const calculateTrend = require("../utils/calculateTrend");
const { generateInsights } = require("../services/insightProcessor");

async function getInsights(req, res) {
    try {
        const workspace = req.user.workspace;

        try {
            await generateInsights(workspace);
        } catch (procErr) {
            console.warn("Background insight generation warning:", procErr.message);
        }

        const insights = await Insight.find({
            workspace,
            status: "ACTIVE"
        })
        .sort({ generatedAt: -1, createdAt: -1 })
        .limit(20)
        .lean();

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

async function triggerInsightGeneration(req, res) {
    try {
        const workspace = req.user.workspace;
        await generateInsights(workspace);

        const insights = await Insight.find({
            workspace,
            status: "ACTIVE"
        })
        .sort({ generatedAt: -1, createdAt: -1 })
        .limit(20)
        .lean();

        res.json({
            message: "Insights generated successfully",
            insights
        });
    } catch (error) {
        console.error("Trigger insight generation error:", error);
        res.status(500).json({
            message: "Failed to generate insights"
        });
    }
}

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
            theme,
            totalFeedback: frequency,
            positive,
            neutral,
            negative,
            negativePercentage: Number(negativePercentage).toFixed(1),
            trendDirection,
            examples
        };

        const aiResult = await generateInsight(statistics);
        const severity = aiResult.severity || aiResult.priority || "MEDIUM";

        const insight = await Insight.create({
            workspace,
            theme,
            type: "THEME_RISK",
            title: aiResult.title,
            summary: aiResult.summary,
            recommendation: aiResult.recommendation,
            severity,
            priority: severity,
            evidence: statistics,
            status: "ACTIVE",
            generatedAt: new Date()
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

module.exports = {
    getInsights,
    triggerInsightGeneration,
    generateThemeInsight
};
