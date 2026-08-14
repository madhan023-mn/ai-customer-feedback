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
    const [trendData, setTrendData] = useState([]);
    const [volumeData, setVolumeData] = useState([]);
    const [channelSentimentData, setChannelSentimentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [range, setRange] = useState("30d");

    async function loadAnalyticsData(selectedRange = range, isRefresh = false) {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const [overviewRes, trendRes, volumeRes, channelRes] = await Promise.all([
                api.get(`/analytics/overview?range=${selectedRange}`),
                api.get(`/analytics/trend?range=${selectedRange}`),
                api.get(`/analytics/volume?range=${selectedRange}`),
                api.get(`/analytics/channel-sentiment?range=${selectedRange}`)
            ]);

            setData(overviewRes.data);
            setTrendData(trendRes.data?.trend || []);
            setVolumeData(volumeRes.data?.volume || []);
            setChannelSentimentData(channelRes.data?.channels || []);
        } catch (err) {
            console.error("Fetch analytics error:", err);
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadAnalyticsData(range);
    }, [range]);

    function formatChartDate(dateStr) {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch (e) {
            return dateStr;
        }
    }

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
                    <button className="btn-secondary" onClick={() => loadAnalyticsData(range)} style={{ marginLeft: "12px", padding: "4px 10px", fontSize: "0.8rem" }}>
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

    const formattedTrendData = trendData.map((item) => ({
        ...item,
        displayDate: formatChartDate(item.date)
    }));

    const formattedVolumeData = volumeData.map((item) => ({
        ...item,
        displayDate: formatChartDate(item.date)
    }));

    const themeSentimentData = buildThemeSentimentData(data?.themeSentiment);

    return (
        <div className="main-content">
            {/* Header with Range Filter */}
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 className="page-title">Sentiment & Theme Analytics</h1>
                    <p className="page-subtitle">Understand customer feedback trends, channel breakdowns, and time-based sentiment metrics</p>
                </div>

                <div className="analytics-controls" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <label style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        Date Range:
                    </label>
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-focus)",
                            backgroundColor: "white",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            cursor: "pointer"
                        }}
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>

                    <button
                        className="btn-secondary"
                        onClick={() => loadAnalyticsData(range, true)}
                        disabled={refreshing}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <RefreshCw size={16} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>
                </div>
            </div>

            {/* Overview Summary Cards */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "2rem" }}>
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

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Trend Data Points</span>
                        <TrendingUp size={18} color="#22c55e" />
                    </div>
                    <strong style={{ fontSize: "2rem", color: "#22c55e", fontWeight: 800 }}>
                        {trendData.length} Days
                    </strong>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>
                        Recorded daily entries
                    </div>
                </div>
            </div>

            {/* Charts Grid Row 1: Sentiment Trend & Feedback Volume */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Sentiment Trend Line Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <div className="analytics-card-header" style={{ marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <TrendingUp size={18} color="var(--primary)" />
                            <span>Sentiment Trend Over Time</span>
                        </h2>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Positive / Neutral / Negative breakdown</span>
                    </div>
                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <LineChart data={formattedTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} />
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

                {/* Daily Feedback Volume Bar Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <div className="analytics-card-header" style={{ marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <BarChart3 size={18} color="var(--primary)" />
                            <span>Daily Feedback Volume</span>
                        </h2>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Records received each day</span>
                    </div>
                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={formattedVolumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" name="Feedback Volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Grid Row 2: Sentiment Distribution & Theme x Sentiment */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Sentiment Pie Chart */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <PieIcon size={18} color="var(--primary)" />
                        <span>Overall Sentiment Distribution</span>
                    </h2>
                    <div style={{ width: "100%", height: 320 }}>
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

            {/* Charts Grid Row 3: Channel x Sentiment & Top Themes Volume */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Channel x Sentiment */}
                <div className="table-card" style={{ padding: "22px", background: "white", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Radio size={18} color="var(--primary)" />
                        <span>Channel × Sentiment Analysis</span>
                    </h2>
                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={channelSentimentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
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

                {/* Top Themes Volume */}
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
                                <Bar dataKey="count" name="Feedback Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
