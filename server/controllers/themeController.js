const Feedback = require("../models/Feedback");
const Theme = require("../models/Theme");
const FeedbackTheme = require("../models/FeedbackTheme");
const calculateTrend = require("../utils/calculateTrend");

// Canonical mapping to consolidate fragmented legacy themes into structured hierarchy
const CANONICAL_THEME_MAP = {
    "Checkout Problem": "Checkout Failure",
    "Payment Gateway Timeout": "Payment Failure",
    "Authentication Problems": "Login Failure",
    "Login Issues": "Login Failure",
    "Authentication Failure": "Login Failure",
    "App Stability": "App Stability & Crashes",
    "Mobile App Stability": "App Stability & Crashes",
    "Mobile Crash": "App Stability & Crashes",
    "Dashboard Latency": "Dashboard Performance",
    "Onboarding Latency": "Onboarding Friction",
    "Notification Latency": "Notification Delay",
    "Fast Login Process": "Login Experience",
    "Smooth Login Experience": "Login Experience",
    "Seamless Authentication": "Login Experience",
    "Smooth Payment Process": "Payment Process",
    "Reliable Billing Experience": "Payment Process",
    "Smooth Checkout Experience": "Checkout Experience",
    "Easy Purchase Flow": "Checkout Experience",
    "Great Customer Support": "Customer Support",
    "Responsive Support Team": "Customer Support",
    "Intuitive Mobile App": "Mobile Experience",
    "High Mobile Performance": "Mobile Experience",
    "Clear Dashboard Insights": "Dashboard UI",
    "Effective Data Visualizations": "Dashboard UI",
    "Fast & Accurate Search": "Search & Filter Speed",
    "Smooth Onboarding Experience": "Onboarding Experience",
    "Timely Notifications": "Notification Delivery",
    "Fast System Performance": "System Performance"
};

function normalizeThemeName(name) {
    if (!name) return "General Feedback";
    const trimmed = String(name).trim();
    return CANONICAL_THEME_MAP[trimmed] || trimmed;
}

function calculateThemePriority(data) {
    const { negativeFeedbackRate, frequency, negative, percentChange, isSpiking } = data;
    
    // Low priority rule: if negative rate is < 15% or negative count is 0 (e.g. Dashboard UI with +233% growth is LOW)
    if (negative === 0 || negativeFeedbackRate < 15) {
        return "LOW";
    }

    // High priority rule: high negative rate (>=40%) with volume, or large number of absolute complaints, or spiking issue
    if (
        (negativeFeedbackRate >= 40 && frequency >= 3) ||
        negative >= 6 ||
        (isSpiking && negativeFeedbackRate >= 30)
    ) {
        return "HIGH";
    }

    // Medium priority rule: moderate negativity rate (15% - 40%) or moderate complaint volume
    if (negativeFeedbackRate >= 15 || negative >= 2) {
        return "MEDIUM";
    }

    return "LOW";
}

async function getThemes(req, res) {
    try {
        const workspace = req.user.workspace;

        // Query Feedback aggregation grouped by theme
        const rawAgg = await Feedback.aggregate([
            { $match: { workspace } },
            {
                $project: {
                    sentiment: 1,
                    createdAt: 1,
                    featureArea: 1,
                    themeList: {
                        $cond: {
                            if: { $and: [{ $isArray: "$themes" }, { $gt: [{ $size: "$themes" }, 0] }] },
                            then: "$themes",
                            else: ["$featureArea"]
                        }
                    }
                }
            },
            { $unwind: "$themeList" },
            { $match: { themeList: { $nin: ["", null, "Other", "General Feedback"] } } },
            {
                $group: {
                    _id: "$themeList",
                    featureArea: { $first: "$featureArea" },
                    frequency: { $sum: 1 },
                    positive: { $sum: { $cond: [{ $eq: ["$sentiment", "POS"] }, 1, 0] } },
                    neutral: { $sum: { $cond: [{ $eq: ["$sentiment", "NEU"] }, 1, 0] } },
                    negative: { $sum: { $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0] } }
                }
            }
        ]);

        // Period-over-period spike detection (past 14 days vs prior 14 days)
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

        const recentCounts = await Feedback.aggregate([
            { $match: { workspace, createdAt: { $gte: fourteenDaysAgo } } },
            {
                $project: {
                    themeList: {
                        $cond: {
                            if: { $and: [{ $isArray: "$themes" }, { $gt: [{ $size: "$themes" }, 0] }] },
                            then: "$themes",
                            else: ["$featureArea"]
                        }
                    }
                }
            },
            { $unwind: "$themeList" },
            { $group: { _id: "$themeList", recentCount: { $sum: 1 } } }
        ]);

        const priorCounts = await Feedback.aggregate([
            { $match: { workspace, createdAt: { $gte: twentyEightDaysAgo, $lt: fourteenDaysAgo } } },
            {
                $project: {
                    themeList: {
                        $cond: {
                            if: { $and: [{ $isArray: "$themes" }, { $gt: [{ $size: "$themes" }, 0] }] },
                            then: "$themes",
                            else: ["$featureArea"]
                        }
                    }
                }
            },
            { $unwind: "$themeList" },
            { $group: { _id: "$themeList", priorCount: { $sum: 1 } } }
        ]);

        const recentMap = new Map(recentCounts.map(r => [r._id, r.recentCount]));
        const priorMap = new Map(priorCounts.map(p => [p._id, p.priorCount]));

        // Consolidate into canonical themes
        const consolidatedMap = new Map();

        for (const item of rawAgg) {
            const canonicalName = normalizeThemeName(item._id);
            const rCount = recentMap.get(item._id) || 0;
            const pCount = priorMap.get(item._id) || 0;

            if (!consolidatedMap.has(canonicalName)) {
                consolidatedMap.set(canonicalName, {
                    _id: canonicalName,
                    name: canonicalName,
                    featureArea: item.featureArea || "General",
                    frequency: 0,
                    positive: 0,
                    neutral: 0,
                    negative: 0,
                    thisMonth: 0,
                    previousMonth: 0
                });
            }

            const current = consolidatedMap.get(canonicalName);
            current.frequency += item.frequency;
            current.positive += item.positive;
            current.neutral += item.neutral;
            current.negative += item.negative;
            current.thisMonth += rCount;
            current.previousMonth += pCount;
        }

        const enrichedThemes = Array.from(consolidatedMap.values()).map(t => {
            const negativeFeedbackRate = t.frequency > 0 ? Number(((t.negative / t.frequency) * 100).toFixed(1)) : 0;
            
            // Calculate percentage change
            let percentChange = 0;
            if (t.previousMonth > 0) {
                percentChange = Math.round(((t.thisMonth - t.previousMonth) / t.previousMonth) * 100);
            } else if (t.thisMonth > 0) {
                percentChange = 100;
            }

            const isSpiking = (percentChange >= 25 && t.thisMonth >= 3) || (negativeFeedbackRate >= 45 && t.frequency >= 3);

            const priority = calculateThemePriority({
                negativeFeedbackRate,
                frequency: t.frequency,
                negative: t.negative,
                percentChange,
                isSpiking
            });

            return {
                ...t,
                negativeFeedbackRate,
                negativePercentage: negativeFeedbackRate, // backwards compatibility
                thisMonth: t.thisMonth,
                previousMonth: t.previousMonth,
                percentChange,
                isSpiking,
                spikePercentage: percentChange,
                priority
            };
        });

        // Sort by priority (HIGH -> MEDIUM -> LOW) then by frequency
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        enrichedThemes.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.frequency - a.frequency;
        });

        const highPriorityCount = enrichedThemes.filter(t => t.priority === "HIGH").length;
        const mediumPriorityCount = enrichedThemes.filter(t => t.priority === "MEDIUM").length;
        const lowPriorityCount = enrichedThemes.filter(t => t.priority === "LOW").length;
        const spikingThemes = enrichedThemes.filter(t => t.isSpiking);

        res.json({
            themes: enrichedThemes,
            spikingThemes,
            summary: {
                totalThemes: enrichedThemes.length,
                highPriority: highPriorityCount,
                mediumPriority: mediumPriorityCount,
                lowPriority: lowPriorityCount
            }
        });
    } catch (error) {
        console.error("Get themes error:", error);
        res.status(500).json({ message: "Failed to load themes" });
    }
}

async function getThemeTrends(req, res) {
    try {
        const workspace = req.user.workspace;
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

        const currentPeriod = await Feedback.aggregate([
            { $match: { workspace, createdAt: { $gte: fourteenDaysAgo } } },
            {
                $project: {
                    themeList: {
                        $cond: {
                            if: { $and: [{ $isArray: "$themes" }, { $gt: [{ $size: "$themes" }, 0] }] },
                            then: "$themes",
                            else: ["$featureArea"]
                        }
                    }
                }
            },
            { $unwind: "$themeList" },
            { $group: { _id: "$themeList", currentCount: { $sum: 1 } } }
        ]);

        const previousPeriod = await Feedback.aggregate([
            { $match: { workspace, createdAt: { $gte: twentyEightDaysAgo, $lt: fourteenDaysAgo } } },
            {
                $project: {
                    themeList: {
                        $cond: {
                            if: { $and: [{ $isArray: "$themes" }, { $gt: [{ $size: "$themes" }, 0] }] },
                            then: "$themes",
                            else: ["$featureArea"]
                        }
                    }
                }
            },
            { $unwind: "$themeList" },
            { $group: { _id: "$themeList", previousCount: { $sum: 1 } } }
        ]);

        const prevMap = new Map(previousPeriod.map(p => [normalizeThemeName(p._id), p.previousCount]));

        const trends = currentPeriod.map(c => {
            const normalizedName = normalizeThemeName(c._id);
            const thisMonth = c.currentCount;
            const previousMonth = prevMap.get(normalizedName) || 0;
            const diff = thisMonth - previousMonth;
            const percentChange = previousMonth > 0 ? Math.round((diff / previousMonth) * 100) : (thisMonth > 0 ? 100 : 0);

            return {
                theme: normalizedName,
                thisMonth,
                previousMonth,
                percentChange,
                isSpike: percentChange >= 25
            };
        }).sort((a, b) => b.thisMonth - a.thisMonth);

        res.json({ trends });
    } catch (error) {
        console.error("Get theme trends error:", error);
        res.status(500).json({ message: "Failed to fetch theme trends" });
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
                    $or: [
                        { themes: theme },
                        { featureArea: theme }
                    ]
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
            { $sort: { _id: 1 } }
        ]);

        res.json({ theme, trend });
    } catch (error) {
        console.error("Get theme trend error:", error);
        res.status(500).json({ message: "Failed to load theme trend" });
    }
}

async function getThemeDetails(req, res) {
    try {
        const theme = decodeURIComponent(req.params.theme);
        const workspace = req.user.workspace;

        const allFeedback = await Feedback.find({
            workspace,
            $or: [
                { themes: theme },
                { featureArea: theme }
            ]
        })
        .sort({ createdAt: -1 })
        .select("content sentiment sentimentScore channel status createdAt featureArea themes aiStatus rationale issue severity priority customerLabel");

        if (!allFeedback.length) {
            return res.status(404).json({ message: "Theme not found" });
        }

        const trend = await Feedback.aggregate([
            {
                $match: {
                    workspace,
                    $or: [
                        { themes: theme },
                        { featureArea: theme }
                    ]
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
            { $sort: { _id: 1 } }
        ]);

        const trendDirection = calculateTrend(trend);
        const feedback = allFeedback.slice(0, 30);
        const total = allFeedback.length;

        const positive = allFeedback.filter(item => item.sentiment === "POS").length;
        const neutral = allFeedback.filter(item => item.sentiment === "NEU").length;
        const negative = allFeedback.filter(item => item.sentiment === "NEG").length;
        const negativePercentage = total === 0 ? 0 : Number(((negative / total) * 100).toFixed(1));
        const negativeFeedbackRate = negativePercentage;

        const priority = calculateThemePriority({
            negativeFeedbackRate,
            frequency: total,
            negative,
            percentChange: 0,
            isSpiking: false
        });

        res.json({
            theme,
            frequency: total,
            negativeFeedbackRate,
            negativePercentage,
            trendDirection,
            trend,
            priority,
            sentiment: { positive, neutral, negative },
            feedback
        });
    } catch (error) {
        console.error("Get theme details error:", error);
        res.status(500).json({ message: "Failed to load theme" });
    }
}

module.exports = {
    getThemes,
    getThemeTrends,
    getThemeTrend,
    getThemeDetails
};
