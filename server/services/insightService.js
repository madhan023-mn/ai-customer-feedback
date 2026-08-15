const Feedback = require("../models/Feedback");
const Insight = require("../models/Insight");
const { generateInsight } = require("./aiService");

function validateInsight(result) {
    if (!result) {
        throw new Error("AI returned no insight");
    }

    if (!result.title || !result.summary || !result.recommendation) {
        throw new Error("AI insight is incomplete");
    }

    const allowedSeverity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const severity = result.severity || result.priority;

    if (!allowedSeverity.includes(severity)) {
        throw new Error("Invalid insight severity");
    }

    return true;
}

async function findThemeRisks(workspace) {
    const results = await Feedback.aggregate([
        {
            $match: {
                workspace,
                featureArea: {
                    $nin: [null, ""]
                },
                sentiment: {
                    $in: ["POS", "NEU", "NEG"]
                }
            }
        },
        {
            $group: {
                _id: {
                    theme: "$featureArea",
                    sentiment: "$sentiment"
                },
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    const themes = {};

    results.forEach(item => {
        const theme = item._id.theme;
        const sentiment = item._id.sentiment;

        if (!themes[theme]) {
            themes[theme] = {
                total: 0,
                POS: 0,
                NEU: 0,
                NEG: 0
            };
        }

        themes[theme][sentiment] = item.count;
        themes[theme].total += item.count;
    });

    Object.keys(themes).forEach(theme => {
        const item = themes[theme];
        item.negativePercentage = item.total > 0
            ? (item.NEG / item.total) * 100
            : 0;
    });

    const riskyThemes = Object.entries(themes).filter(
        ([theme, data]) => {
            return (
                data.total >= 5 &&
                data.negativePercentage >= 50
            );
        }
    );

    for (const [theme, data] of riskyThemes) {
        const existing = await Insight.findOne({
            workspace,
            type: "THEME_RISK",
            theme,
            status: "ACTIVE"
        });

        if (existing) {
            continue;
        }

        const analysisData = {
            theme,
            totalFeedback: data.total,
            positive: data.POS,
            neutral: data.NEU,
            negative: data.NEG,
            negativePercentage: Number(data.negativePercentage).toFixed(1)
        };

        try {
            const aiResult = await generateInsight(analysisData);
            validateInsight(aiResult);

            const severity = aiResult.severity || aiResult.priority || "HIGH";

            await Insight.create({
                workspace,
                title: aiResult.title,
                type: "THEME_RISK",
                severity,
                priority: severity,
                summary: aiResult.summary,
                theme,
                recommendation: aiResult.recommendation,
                evidence: analysisData,
                status: "ACTIVE",
                generatedAt: new Date()
            });

            console.log("Created theme risk insight for theme:", theme);
        } catch (err) {
            console.error(`Failed to generate/save insight for theme ${theme}:`, err.message);
        }
    }
}

module.exports = {
    findThemeRisks,
    validateInsight
};
