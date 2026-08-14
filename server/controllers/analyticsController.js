const Feedback = require("../models/Feedback");

async function getAnalyticsOverview(req, res) {
    try {
        const workspace = req.user.workspace;
        const { range = "30d" } = req.query;

        // Date range filter calculation
        let startDate = null;
        const now = new Date();
        if (range === "7d") {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (range === "90d") {
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        } else {
            // Default 30d
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const dateMatch = startDate ? { createdAt: { $gte: startDate } } : {};

        const analyzedFilter = {
            workspace,
            ...dateMatch,
            sentiment: {
                $in: ["POS", "NEU", "NEG"]
            }
        };

        const [
            totalAnalyzed,
            sentimentDistribution,
            themeDistribution,
            themeSentiment,
            channelDistribution,
            sentimentTrendAgg
        ] = await Promise.all([
            Feedback.countDocuments(analyzedFilter),
            Feedback.aggregate([
                { $match: analyzedFilter },
                {
                    $group: {
                        _id: "$sentiment",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]),
            Feedback.aggregate([
                {
                    $match: {
                        workspace,
                        ...dateMatch,
                        featureArea: { $nin: [null, ""] }
                    }
                },
                {
                    $group: {
                        _id: "$featureArea",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Feedback.aggregate([
                {
                    $match: {
                        workspace,
                        ...dateMatch,
                        featureArea: { $nin: [null, ""] },
                        sentiment: { $in: ["POS", "NEU", "NEG"] }
                    }
                },
                {
                    $group: {
                        _id: {
                            theme: "$featureArea",
                            sentiment: "$sentiment"
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.theme": 1 } }
            ]),
            Feedback.aggregate([
                {
                    $match: {
                        workspace,
                        ...dateMatch
                    }
                },
                {
                    $group: {
                        _id: "$channel",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]),
            Feedback.aggregate([
                {
                    $match: {
                        workspace,
                        ...dateMatch,
                        sentiment: { $in: ["POS", "NEU", "NEG"] }
                    }
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            sentiment: "$sentiment"
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.date": 1 } }
            ])
        ]);

        res.json({
            range,
            totalAnalyzed,
            sentimentDistribution,
            themeDistribution,
            themeSentiment,
            channelDistribution,
            sentimentTrend: sentimentTrendAgg
        });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({
            message: "Failed to load analytics"
        });
    }
}

module.exports = {
    getAnalyticsOverview
};
