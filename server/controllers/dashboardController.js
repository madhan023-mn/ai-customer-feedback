const Feedback = require("../models/Feedback");

async function getDashboardStats(req, res) {
    try {
        const workspaceId = req.user.workspace;

        const [
            total,
            sentimentAgg,
            channelAgg,
            statusAgg,
            featureAgg,
            trendAgg,
            recentCount,
            pendingAi,
            failedAi
        ] = await Promise.all([
            Feedback.countDocuments({ workspace: workspaceId }),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                { $group: { _id: "$sentiment", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                { $group: { _id: "$channel", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                {
                    $match: {
                        workspace: workspaceId,
                        featureArea: { $exists: true, $nin: ["", null] }
                    }
                },
                { $group: { _id: "$featureArea", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 14 }
            ]),
            Feedback.countDocuments({
                workspace: workspaceId,
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }),
            Feedback.countDocuments({ workspace: workspaceId, aiStatus: "PENDING" }),
            Feedback.countDocuments({ workspace: workspaceId, aiStatus: "FAILED" })
        ]);

        const sentimentObj = { POS: 0, NEU: 0, NEG: 0 };
        sentimentAgg.forEach(item => {
            if (item._id) sentimentObj[item._id] = item.count;
        });

        const channelsObj = {
            SUPPORT_TICKET: 0,
            APP_STORE: 0,
            NPS_SURVEY: 0,
            SALES_CALL: 0,
            COMMUNITY: 0
        };
        channelAgg.forEach(item => {
            if (item._id) channelsObj[item._id] = item.count;
        });

        const statusObj = { NEW: 0, REVIEWED: 0, ACTIONED: 0 };
        statusAgg.forEach(item => {
            if (item._id) statusObj[item._id] = item.count;
        });

        res.json({
            total,
            totalFeedback: total,
            recent7Days: recentCount,
            pendingAi,
            failedAi,
            sentiment: sentimentObj,
            sentimentStats: sentimentAgg,
            channels: channelsObj,
            channelStats: channelAgg,
            status: statusObj,
            statusStats: statusAgg,
            featureStats: featureAgg,
            feedbackTrend: trendAgg
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
}

module.exports = {
    getDashboardStats,
    getDashboardAnalytics: getDashboardStats
};
