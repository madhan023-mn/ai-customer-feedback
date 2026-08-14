const Feedback = require("../models/Feedback");
const calculateTrend = require("../utils/calculateTrend");

async function getThemes(req, res) {
    try {
        const workspace = req.user.workspace;

        const themes = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    featureArea: {
                        $exists: true,
                        $nin: ["", null]
                    }
                }
            },
            {
                $group: {
                    _id: "$featureArea",
                    frequency: { $sum: 1 },
                    positive: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "POS"] }, 1, 0]
                        }
                    },
                    neutral: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "NEU"] }, 1, 0]
                        }
                    },
                    negative: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $addFields: {
                    negativePercentage: {
                        $multiply: [
                            {
                                $divide: ["$negative", "$frequency"]
                            },
                            100
                        ]
                    }
                }
            },
            {
                $sort: {
                    frequency: -1
                }
            }
        ]);

        // Period-over-period spike detection
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

        const recentCounts = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    createdAt: { $gte: fourteenDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$featureArea",
                    recentCount: { $sum: 1 },
                    recentNegative: {
                        $sum: { $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0] }
                    }
                }
            }
        ]);

        const priorCounts = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    createdAt: { $gte: twentyEightDaysAgo, $lt: fourteenDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$featureArea",
                    priorCount: { $sum: 1 }
                }
            }
        ]);

        const recentMap = new Map(recentCounts.map(r => [r._id, r]));
        const priorMap = new Map(priorCounts.map(p => [p._id, p.priorCount]));

        const enrichedThemes = themes.map(t => {
            const recent = recentMap.get(t._id);
            const rCount = recent?.recentCount || 0;
            const pCount = priorMap.get(t._id) || 0;
            const negPct = t.negativePercentage || 0;

            let isSpiking = false;
            let spikePercentage = 0;

            if (pCount > 0) {
                spikePercentage = Math.round(((rCount - pCount) / pCount) * 100);
                if (spikePercentage >= 25 || negPct >= 45) {
                    isSpiking = true;
                }
            } else if (rCount >= 3 || negPct >= 45) {
                isSpiking = true;
                spikePercentage = 50;
            }

            return {
                ...t,
                isSpiking,
                spikePercentage
            };
        });

        const spikingThemes = enrichedThemes.filter(t => t.isSpiking);

        res.json({
            themes: enrichedThemes,
            spikingThemes
        });
    } catch (error) {
        console.error("Get themes error:", error);
        res.status(500).json({
            message: "Failed to load themes"
        });
    }
}


async function getThemeTrend(req, res) {
    try {
        const theme = decodeURIComponent(req.params.theme);
        const workspace = req.user.workspace;

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
                    count: { $sum: 1 },
                    negative: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        res.json({
            theme,
            trend
        });
    } catch (error) {
        console.error("Get theme trend error:", error);
        res.status(500).json({
            message: "Failed to load theme trend"
        });
    }
}

async function getThemeDetails(req, res) {
    try {
        const theme = decodeURIComponent(req.params.theme);
        const workspace = req.user.workspace;

        const allFeedback = await Feedback.find({
            workspace,
            featureArea: theme
        })
        .sort({ createdAt: -1 })
        .select("content sentiment sentimentScore channel status createdAt featureArea aiStatus rationale");

        if (!allFeedback.length) {
            return res.status(404).json({
                message: "Theme not found"
            });
        }

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
                    count: { $sum: 1 },
                    negative: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const trendDirection = calculateTrend(trend);
        const feedback = allFeedback.slice(0, 20);
        const total = allFeedback.length;

        const positive = allFeedback.filter(item => item.sentiment === "POS").length;
        const neutral = allFeedback.filter(item => item.sentiment === "NEU").length;
        const negative = allFeedback.filter(item => item.sentiment === "NEG").length;

        const negativePercentage = total === 0 ? 0 : (negative / total) * 100;

        res.json({
            theme,
            frequency: total,
            negativePercentage,
            trendDirection,
            trend,
            sentiment: {
                positive,
                neutral,
                negative
            },
            feedback
        });
    } catch (error) {
        console.error("Get theme details error:", error);
        res.status(500).json({
            message: "Failed to load theme"
        });
    }
}

module.exports = {
    getThemes,
    getThemeTrend,
    getThemeDetails
};
