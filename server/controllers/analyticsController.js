const Feedback = require("../models/Feedback");

const ALLOWED_RANGES = ["7d", "30d", "90d"];

function calculateStartDate(range) {
    const now = new Date();
    const startDate = new Date(now);

    if (range === "7d") {
        startDate.setDate(now.getDate() - 7);
    } else if (range === "90d") {
        startDate.setDate(now.getDate() - 90);
    } else {
        startDate.setDate(now.getDate() - 30);
    }

    return { startDate, now };
}

async function getAnalyticsOverview(req, res) {
    try {
        const workspace = req.user.workspace;
        const range = req.query.range || "30d";

        if (!ALLOWED_RANGES.includes(range)) {
            return res.status(400).json({
                message: "Invalid range. Use 7d, 30d or 90d."
            });
        }

        const { startDate } = calculateStartDate(range);
        const dateMatch = { createdAt: { $gte: startDate } };

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

async function getSentimentTrend(req, res) {
    try {
        const workspace = req.user.workspace;
        const range = req.query.range || "30d";

        if (!ALLOWED_RANGES.includes(range)) {
            return res.status(400).json({
                message: "Invalid range. Use 7d, 30d or 90d."
            });
        }

        const { startDate, now } = calculateStartDate(range);

        const trend = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    createdAt: {
                        $gte: startDate,
                        $lte: now
                    },
                    sentiment: {
                        $in: ["POS", "NEU", "NEG"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        },
                        sentiment: "$sentiment"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.date": 1
                }
            }
        ]);

        const formattedTrend = {};

        trend.forEach(item => {
            const date = item._id.date;
            const sentiment = item._id.sentiment;

            if (!formattedTrend[date]) {
                formattedTrend[date] = {
                    date,
                    POS: 0,
                    NEU: 0,
                    NEG: 0
                };
            }

            formattedTrend[date][sentiment] = item.count;
        });

        const result = Object.values(formattedTrend);

        res.json({
            range,
            startDate,
            endDate: now,
            trend: result
        });
    } catch (error) {
        console.error("Sentiment trend error:", error);
        res.status(500).json({
            message: "Failed to load sentiment trend"
        });
    }
}

async function getFeedbackVolumeTrend(req, res) {
    try {
        const workspace = req.user.workspace;
        const range = req.query.range || "30d";

        if (!ALLOWED_RANGES.includes(range)) {
            return res.status(400).json({
                message: "Invalid range. Use 7d, 30d or 90d."
            });
        }

        const { startDate, now } = calculateStartDate(range);

        const volume = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    createdAt: {
                        $gte: startDate,
                        $lte: now
                    }
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
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]);

        res.json({
            range,
            volume
        });
    } catch (error) {
        console.error("Volume trend error:", error);
        res.status(500).json({
            message: "Failed to load volume trend"
        });
    }
}

async function getChannelSentiment(req, res) {
    try {
        const workspace = req.user.workspace;
        const range = req.query.range || "30d";

        if (!ALLOWED_RANGES.includes(range)) {
            return res.status(400).json({
                message: "Invalid range. Use 7d, 30d or 90d."
            });
        }

        const { startDate } = calculateStartDate(range);

        const channelAgg = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    createdAt: { $gte: startDate },
                    sentiment: { $in: ["POS", "NEU", "NEG"] }
                }
            },
            {
                $group: {
                    _id: {
                        channel: "$channel",
                        sentiment: "$sentiment"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.channel": 1 } }
        ]);

        const formatted = {};
        channelAgg.forEach(item => {
            const channel = item._id.channel || "UNKNOWN";
            const sentiment = item._id.sentiment;

            if (!formatted[channel]) {
                formatted[channel] = { channel, POS: 0, NEU: 0, NEG: 0 };
            }
            formatted[channel][sentiment] = item.count;
        });

        res.json({
            range,
            channels: Object.values(formatted)
        });
    } catch (error) {
        console.error("Channel sentiment error:", error);
        res.status(500).json({
            message: "Failed to load channel sentiment breakdown"
        });
    }
}

module.exports = {
    getAnalyticsOverview,
    getSentimentTrend,
    getFeedbackVolumeTrend,
    getChannelSentiment
};
