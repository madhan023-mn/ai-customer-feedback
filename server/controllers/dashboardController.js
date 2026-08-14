const Feedback = require("../models/Feedback");

async function getDashboardSummary(req, res) {
    try {
        const workspace = req.user.workspace;

        const [
            totalFeedback,
            sentimentSummary,
            topThemes,
            aiSummary,
            criticalFeedback,
            channelAgg,
            statusAgg,
            trendAgg,
            themeSentimentAgg
        ] = await Promise.all([
            Feedback.countDocuments({ workspace }),
            Feedback.aggregate([
                { $match: { workspace } },
                { $group: { _id: "$sentiment", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                {
                    $match: {
                        workspace,
                        featureArea: { $nin: [null, ""] }
                    }
                },
                { $group: { _id: "$featureArea", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Feedback.aggregate([
                { $match: { workspace } },
                { $group: { _id: "$aiStatus", count: { $sum: 1 } } }
            ]),
            Feedback.find({
                workspace,
                sentiment: "NEG"
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("content sentiment sentimentScore featureArea channel status createdAt")
                .lean(),
            Feedback.aggregate([
                { $match: { workspace } },
                { $group: { _id: "$channel", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                { $match: { workspace } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                { $match: { workspace } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 14 }
            ]),
            Feedback.aggregate([
                { $match: { workspace, featureArea: { $nin: [null, ""] } } },
                {
                    $group: {
                        _id: { featureArea: "$featureArea", sentiment: "$sentiment" },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const sentimentCounts = { POS: 0, NEU: 0, NEG: 0 };
        (sentimentSummary || []).forEach(item => {
            if (item._id && sentimentCounts[item._id] !== undefined) {
                sentimentCounts[item._id] = item.count;
            }
        });

        const analyzedTotal = sentimentCounts.POS + sentimentCounts.NEU + sentimentCounts.NEG;

        const sentimentPercentages = {
            POS: analyzedTotal ? Number((sentimentCounts.POS / analyzedTotal) * 100).toFixed(1) : "0.0",
            NEU: analyzedTotal ? Number((sentimentCounts.NEU / analyzedTotal) * 100).toFixed(1) : "0.0",
            NEG: analyzedTotal ? Number((sentimentCounts.NEG / analyzedTotal) * 100).toFixed(1) : "0.0"
        };

        const aiCounts = { PENDING: 0, PROCESSING: 0, COMPLETED: 0, FAILED: 0 };
        (aiSummary || []).forEach(item => {
            if (item._id && aiCounts[item._id] !== undefined) {
                aiCounts[item._id] = item.count;
            }
        });

        const channelsObj = {
            SUPPORT_TICKET: 0,
            APP_STORE: 0,
            NPS_SURVEY: 0,
            SALES_CALL: 0,
            COMMUNITY: 0
        };
        (channelAgg || []).forEach(item => {
            if (item._id) channelsObj[item._id] = item.count;
        });

        const statusObj = { NEW: 0, REVIEWED: 0, ACTIONED: 0, RESOLVED: 0, ARCHIVED: 0 };
        (statusAgg || []).forEach(item => {
            if (item._id) statusObj[item._id] = item.count;
        });

        res.json({
            total: totalFeedback,
            totalFeedback,
            analyzedFeedback: analyzedTotal,
            sentiment: {
                counts: sentimentCounts,
                percentages: sentimentPercentages,
                POS: sentimentCounts.POS,
                NEU: sentimentCounts.NEU,
                NEG: sentimentCounts.NEG
            },
            topThemes,
            aiProcessing: aiCounts,
            aiQueue: aiCounts,
            pendingAi: aiCounts.PENDING,
            failedAi: aiCounts.FAILED,
            criticalFeedback,
            recentCritical: criticalFeedback,
            channels: channelsObj,
            channelStats: channelAgg,
            status: statusObj,
            statusStats: statusAgg,
            featureStats: topThemes,
            feedbackTrend: trendAgg,
            themeSentiment: themeSentimentAgg
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            message: "Failed to load dashboard"
        });
    }
}

module.exports = {
    getDashboardSummary,
    getDashboardStats: getDashboardSummary,
    getDashboardAnalytics: getDashboardSummary
};
