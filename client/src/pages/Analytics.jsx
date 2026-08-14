import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line
} from "recharts";
import {
    BarChart3,
    TrendingUp,
    Calendar,
    RefreshCw,
    AlertCircle,
    Loader2,
    Layers,
    Radio,
    PieChart as PieIcon
} from "lucide-react";

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [range, setRange] = useState("30d");

    async function loadAnalytics(selectedRange = range, isRefresh = false) {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const response = await api.get(`/analytics/overview?range=${selectedRange}`);
            setData(response.data);
        } catch (err) {
            console.error("Fetch analytics error:", err);
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadAnalytics(range);
    }, [range]);

    function buildThemeSentimentData(items) {
        if (!Array.isArray(items)) return [];
        const themes = {};

        items.forEach((item) => {
            const theme = item._id?.theme || "Uncategorized";
            const sentiment = item._id?.sentiment;

            if (!themes[theme]) {
                themes[theme] = {
                    theme,
                    POS: 0,
                    NEU: 0,
                    NEG: 0
                };
            }

            if (sentiment && themes[theme][sentiment] !== undefined) {
                themes[theme][sentiment] = item.count;
            }
        });

        return Object.values(themes);
    }

    function buildTrendData(items) {
        if (!Array.isArray(items)) return [];
        const trends = {};

        items.forEach((item) => {
            const date = item._id?.date;
            const sentiment = item._id?.sentiment;
            if (!date) return;

            if (!trends[date]) {
                trends[date] = {
                    date,
                    POS: 0,
                    NEU: 0,
                    NEG: 0
                };
            }

            if (sentiment && trends[date][sentiment] !== undefined) {
                trends[date][sentiment] = item.count;
            }
        });

        return Object.values(trends);
    }

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading-spinner" style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Loading sentiment & theme analytics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content">
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button className="btn-secondary" onClick={() => loadAnalytics(range)} style={{ marginLeft: "12px", padding: "4px 10px", fontSize: "0.8rem" }}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const sentimentData = (data?.sentimentDistribution || []).map((item) => {
        const labels = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };
        return {
            name: labels[item._id] || item._id,
            value: item.count,
            color: item._id === "POS" ? "#22c55e" : item._id === "NEG" ? "#ef4444" : "#94a3b8"
        };
    });

    const themeData = (data?.themeDistribution || []).map((item) => ({
        name: item._id || "Uncategorized",
        count: item.count
    }));

    const channelData = (data?.channelDistribution || []).map((item) => ({
        name: item._id || "Unknown",
        count: item.count
    }));

    const themeSentimentData = buildThemeSentimentData(data?.themeSentiment);
    const trendData = buildTrendData(data?.sentimentTrend);

    return (
        <div className="main-content">
            {/* Header with Range Filter */}
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 className="page-title">Sentiment & Theme Analytics</h1>
                    <p className="page-subtitle">Understand customer feedback trends, channel breakdowns, and theme sentiment correlations</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Time Range Selector */}
                    <div style={{ display: "flex", background: "#f1f5f9", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                        <button
                            className={`btn-secondary ${range === "7d" ? "active" : ""}`}
                            onClick={() => setRange("7d")}
                            style={{
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                background: range === "7d" ? "white" : "transparent",
                                boxShadow: range === "7d" ? "var(--shadow-sm)" : "none",
                                border: "none",
                                fontWeight: range === "7d" ? 700 : 500
                            }}
                        >
                            7 Days
                        </button>
                        <button
                            className={`btn-secondary ${range === "30d" ? "active" : ""}`}
                            onClick={() => setRange("30d")}
                            style={{
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                background: range === "30d" ? "white" : "transparent",
                                boxShadow: range === "30d" ? "var(--shadow-sm)" : "none",
                                border: "none",
                                fontWeight: range === "30d" ? 700 : 500
                            }}
                        >
                            30 Days
                        </button>
                        <button
                            className={`btn-secondary ${range === "90d" ? "active" : ""}`}
                            onClick={() => setRange("90d")}
                            style={{
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                background: range === "90d" ? "white" : "transparent",
                                boxShadow: range === "90d" ? "var(--shadow-sm)" : "none",
                                border: "none",
                                fontWeight: range === "90d" ? 700 : 500
                            }}
                        >
                            90 Days
                        </button>
                    </div>

                    <button
                        className="btn-secondary"
                        onClick={() => loadAnalytics(range, true)}
                        disabled={refreshing}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <RefreshCw size={16} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>
                </div>
            </div>

            {/* Overview Summary Card */}
            <div className="stats-grid" style={{ marginBottom: "2rem" }}>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Analyzed Feedback Records</span>
                        <Calendar size={18} color="var(--primary)" />
                    </div>
                    <strong style={{ fontSize: "2rem", color: "var(--text-main)", fontWeight: 800 }}>
                        {data?.totalAnalyzed ?? 0}
                    </strong>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>
                        Filtered by range: {range.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Charts Grid Row 1: Sentiment Distribution & Time Trend */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Sentiment Pie Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <PieIcon size={18} color="var(--primary)" />
                        <span>Sentiment Distribution</span>
                    </h2>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={95}
                                    label
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment Trend Line Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <TrendingUp size={18} color="var(--primary)" />
                        <span>Sentiment Trend Over Time</span>
                    </h2>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="POS" name="Positive" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="NEU" name="Neutral" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="NEG" name="Negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Grid Row 2: Top Themes & Theme x Sentiment Stacked Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Top Themes Bar Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <BarChart3 size={18} color="var(--primary)" />
                        <span>Top Themes Volume</span>
                    </h2>
                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={themeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Feedback Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Theme x Sentiment Multi-Bar Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Layers size={18} color="var(--primary)" />
                        <span>Theme × Sentiment Breakdown</span>
                    </h2>
                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={themeSentimentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="theme" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="POS" name="Positive" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="NEU" name="Neutral" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="NEG" name="Negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Channel Analysis Chart */}
            <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Radio size={18} color="var(--primary)" />
                    <span>Feedback Volume by Channel</span>
                </h2>
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={channelData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Channel Volume" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
