const Feedback = require("../models/Feedback");
const Insight = require("../models/Insight");
const { generateCSV, generatePDF } = require("../utils/reportExport");

function getDateRange(from, to) {
    const start = new Date(from);
    const end = new Date(to);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error("Invalid date range");
    }

    if (start > end) {
        throw new Error("Start date cannot be after end date");
    }

    end.setHours(23, 59, 59, 999);

    const maxRange = 365 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > maxRange) {
        throw new Error("Date range cannot exceed one year");
    }

    return { start, end };
}

async function getFeedbackForReport(workspace, start, end) {
    return Feedback.find({
        workspace,
        createdAt: {
            $gte: start,
            $lte: end
        }
    })
    .sort({ createdAt: -1 })
    .lean();
}

async function getReport(req, res) {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                message: "from and to dates are required"
            });
        }

        const { start, end } = getDateRange(from, to);
        const workspace = req.user.workspace;

        const dateFilter = {
            workspace,
            createdAt: {
                $gte: start,
                $lte: end
            }
        };

        const totalFeedback = await Feedback.countDocuments(dateFilter);

        const sentimentStats = await Feedback.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: "$sentiment",
                    count: { $sum: 1 }
                }
            }
        ]);

        const positive = sentimentStats.find(item => item._id === "POS")?.count || 0;
        const neutral = sentimentStats.find(item => item._id === "NEU")?.count || 0;
        const negative = sentimentStats.find(item => item._id === "NEG")?.count || 0;

        const sentimentPercentage = {
            positive: totalFeedback ? (positive / totalFeedback) * 100 : 0,
            neutral: totalFeedback ? (neutral / totalFeedback) * 100 : 0,
            negative: totalFeedback ? (negative / totalFeedback) * 100 : 0
        };

        const themeStats = await Feedback.aggregate([
            {
                $match: {
                    ...dateFilter,
                    featureArea: {
                        $exists: true,
                        $nin: ["", null]
                    }
                }
            },
            {
                $group: {
                    _id: "$featureArea",
                    count: { $sum: 1 },
                    negative: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        const insights = await Insight.find({
            workspace,
            createdAt: {
                $gte: start,
                $lte: end
            }
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

        res.json({
            dateRange: {
                from: start,
                to: end
            },
            summary: {
                totalFeedback,
                positive,
                neutral,
                negative
            },
            sentimentPercentage,
            themes: themeStats,
            insights
        });
    } catch (error) {
        console.error("Report error:", error);
        res.status(500).json({
            message: error.message || "Failed to generate report"
        });
    }
}

async function exportCSV(req, res) {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                message: "from and to dates are required"
            });
        }

        const { start, end } = getDateRange(from, to);
        const feedback = await getFeedbackForReport(req.user.workspace, start, end);
        const csv = generateCSV(feedback);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="loop-feedback-${from}-to-${to}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error("CSV export error:", error);
        res.status(500).json({
            message: error.message || "Failed to export CSV"
        });
    }
}

async function exportPDF(req, res) {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                message: "from and to dates are required"
            });
        }

        const { start, end } = getDateRange(from, to);
        const workspace = req.user.workspace;

        const feedback = await getFeedbackForReport(workspace, start, end);
        const dateFilter = {
            workspace,
            createdAt: {
                $gte: start,
                $lte: end
            }
        };

        const totalFeedback = feedback.length;
        const positive = feedback.filter(item => item.sentiment === "POS").length;
        const neutral = feedback.filter(item => item.sentiment === "NEU").length;
        const negative = feedback.filter(item => item.sentiment === "NEG").length;

        const sentimentPercentage = {
            positive: totalFeedback ? (positive / totalFeedback) * 100 : 0,
            neutral: totalFeedback ? (neutral / totalFeedback) * 100 : 0,
            negative: totalFeedback ? (negative / totalFeedback) * 100 : 0
        };

        const themes = await Feedback.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: "$featureArea",
                    count: { $sum: 1 },
                    negative: {
                        $sum: {
                            $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const insights = await Insight.find(dateFilter)
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const report = {
            dateRange: {
                from: start,
                to: end
            },
            summary: {
                totalFeedback,
                positive,
                neutral,
                negative
            },
            sentimentPercentage,
            themes,
            insights
        };

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="loop-report-${from}-to-${to}.pdf"`);

        generatePDF(report, feedback, res);
    } catch (error) {
        console.error("PDF export error:", error);
        res.status(500).json({
            message: error.message || "Failed to export PDF"
        });
    }
}

module.exports = {
    getReport,
    exportCSV,
    exportPDF,
    exportReportCSV: exportCSV,
    exportReportPDF: exportPDF
};
