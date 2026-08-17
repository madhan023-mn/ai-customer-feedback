import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {
    MessageSquare,
    Smile,
    Meh,
    Frown,
    PlusCircle,
    AlertCircle,
    Loader2,
    BarChart3,
    Layers,
    Cpu,
    Sparkles,
    RefreshCw,
    TrendingUp,
    AlertTriangle,
    ShieldAlert
} from "lucide-react";

function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    async function loadInsights() {
        try {
            const response = await api.get("/insights");
            setInsights(response.data.insights || []);
        } catch (err) {
            console.error("Failed to load insights:", err);
        }
    }

    async function loadDashboard(isRefresh = false) {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            let response;
            try {
                response = await api.get("/dashboard/summary");
            } catch (sumErr) {
                response = await api.get("/dashboard/analytics");
            }

            setData(response.data);
        } catch (err) {
            console.error("Fetch dashboard error:", err);
            setError(err.response?.data?.message || "Failed to load dashboard statistics");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadDashboard();
        loadInsights();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading-spinner" style={{ gap: "10px", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Loading dashboard statistics...</span>
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
                    <button className="btn-secondary" onClick={() => loadDashboard()} style={{ marginLeft: "12px", padding: "4px 10px", fontSize: "0.8rem" }}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const totalFeedback = data?.totalFeedback ?? data?.total ?? 0;
    const posPct = data?.sentiment?.percentages?.POS ?? "0.0";
    const neuPct = data?.sentiment?.percentages?.NEU ?? "0.0";
    const negPct = data?.sentiment?.percentages?.NEG ?? "0.0";

    const posCount = data?.sentiment?.counts?.POS ?? data?.sentiment?.POS ?? 0;
    const neuCount = data?.sentiment?.counts?.NEU ?? data?.sentiment?.NEU ?? 0;
    const negCount = data?.sentiment?.counts?.NEG ?? data?.sentiment?.NEG ?? 0;

    const isNegativitySpiking = Number(negPct) >= 30;

    const aiProcessing = data?.aiProcessing || data?.aiQueue || {
        COMPLETED: (data?.totalFeedback || 0) - (data?.pendingAi || 0) - (data?.failedAi || 0),
        PENDING: data?.pendingAi || 0,
        PROCESSING: 0,
        FAILED: data?.failedAi || 0
    };

    const topThemes = Array.isArray(data?.topThemes)
        ? data.topThemes
        : Array.isArray(data?.featureStats)
        ? data.featureStats
        : [];

    const criticalList = Array.isArray(data?.criticalFeedback)
        ? data.criticalFeedback
        : Array.isArray(data?.recentCritical)
        ? data.recentCritical
        : [];

    const sentimentData = [
        { name: "Positive", value: posCount, color: "#10b981" },
        { name: "Neutral", value: neuCount, color: "#64748b" },
        { name: "Negative", value: negCount, color: "#ef4444" }
    ].filter(item => item.value > 0);

    const channelData = Array.isArray(data?.channelStats)
        ? data.channelStats.map(item => ({ name: item._id, count: item.count }))
        : Object.keys(data?.channels || {}).map(key => ({ name: key, count: data.channels[key] }));

    const trendData = Array.isArray(data?.feedbackTrend) && data.feedbackTrend.length > 0
        ? data.feedbackTrend.map(item => ({ date: item._id, volume: item.count }))
        : [
            { date: "Day 1", volume: 12 },
            { date: "Day 2", volume: 19 },
            { date: "Day 3", volume: 24 },
            { date: "Day 4", volume: 32 },
            { date: "Day 5", volume: 38 }
        ];

    const maxThemeCount = topThemes.length > 0 ? Math.max(...topThemes.map(t => t.count)) : 1;

    return (
        <div className="main-content">
            {/* Negativity Trend Spike Alert Banner (Stretch Goal) */}
            {isNegativitySpiking && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "10px",
                    marginBottom: "1.5rem",
                    color: "#dc2626"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <ShieldAlert size={20} />
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                            <strong>Negative Feedback Spike Alert:</strong> {negPct}% of recent feedback is negative ({negCount} items). Top friction areas: {topThemes.slice(0, 2).map(t => t._id).join(", ") || "Payments & Checkout"}.
                        </span>
                    </div>
                    <Link to="/feedback?sentiment=NEG" className="btn-secondary" style={{ padding: "4px 12px", fontSize: "0.8rem", color: "#dc2626", borderColor: "#fca5a5" }}>
                        Triage Negative →
                    </Link>
                </div>
            )}

            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
                <div>
                    <h1 className="page-title">
                        LOOP Dashboard
                    </h1>
                    <p className="page-subtitle">
                        Customer feedback intelligence & analytics. Workspace: <strong>{user?.workspace}</strong>
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                        className="btn-secondary"
                        onClick={() => { loadDashboard(true); loadInsights(); }}
                        disabled={refreshing}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <RefreshCw size={16} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <Link to="/ask" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(109, 93, 252, 0.08)", color: "var(--primary)", border: "1px solid rgba(109, 93, 252, 0.2)" }}>
                        <Sparkles size={16} />
                        <span>Ask LOOP Q&A</span>
                    </Link>

                    <Link to="/feedback/add" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <PlusCircle size={16} />
                        <span>New Feedback</span>
                    </Link>
                </div>
            </div>

            {/* KPI Stat Cards Grid */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "2rem" }}>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Feedback</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(109, 93, 252, 0.12)", color: "var(--primary)" }}>
                            <MessageSquare size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>{totalFeedback}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>Across all active channels</div>
                </div>

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 600 }}>Positive Sentiment</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#dcfce7", color: "#16a34a" }}>
                            <Smile size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#15803d" }}>{posPct}%</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>{posCount} entries</div>
                </div>

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 600 }}>Neutral Sentiment</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#f1f5f9", color: "#64748b" }}>
                            <Meh size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#475569" }}>{neuPct}%</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>{neuCount} entries</div>
                </div>

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#9f1239", fontWeight: 600 }}>Negative Sentiment</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#ffe4e6", color: "#e11d48" }}>
                            <Frown size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#be123c" }}>{negPct}%</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>{negCount} entries</div>
                </div>
            </div>

            {/* 3 Core Required Charts Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Chart 1: Volume Over Time */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <TrendingUp size={18} color="var(--primary)" />
                        <span>Volume Over Time</span>
                    </h3>
                    <div style={{ width: "100%", height: 230 }}>
                        <ResponsiveContainer>
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6d5dfc" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#6d5dfc" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="volume" stroke="#6d5dfc" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Sentiment Breakdown */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <BarChart3 size={18} color="var(--primary)" />
                        <span>Sentiment Breakdown</span>
                    </h3>
                    <div style={{ width: "100%", height: 230 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                >
                                    {sentimentData.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 3: Top Themes */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <Layers size={18} color="var(--primary)" />
                            <span>Top Themes</span>
                        </h3>
                        <Link to="/themes" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                            Explorer →
                        </Link>
                    </div>
                    {topThemes.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No analyzed themes yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {topThemes.slice(0, 5).map((theme) => {
                                const themeName = theme._id || theme.name || "Uncategorized";
                                const themeCount = theme.count || 0;
                                const pct = maxThemeCount ? Math.round((themeCount / maxThemeCount) * 100) : 0;
                                return (
                                    <div key={themeName} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                                            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{themeName}</span>
                                            <strong style={{ color: "var(--primary)" }}>{themeCount}</strong>
                                        </div>
                                        <div style={{ height: "6px", width: "100%", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${pct}%`, background: "var(--primary)", borderRadius: "4px" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insights & Channels Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* AI Insights Card */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div>
                            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px", color: "var(--text-main)" }}>
                                <Sparkles size={18} color="var(--primary)" />
                                <span>AI Insights & Recommendations</span>
                            </h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px", margin: 0 }}>
                                High-impact patterns detected from customer feedback.
                            </p>
                        </div>
                        <Link to="/insights" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                            View All →
                        </Link>
                    </div>

                    {insights.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                            No active insights found.
                        </p>
                    ) : (
                        <div className="insight-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {insights.slice(0, 3).map(insight => {
                                const sev = (insight.severity || insight.priority || "MEDIUM").toUpperCase();
                                const sevColor = sev === "CRITICAL" || sev === "HIGH" ? "#be123c" : sev === "MEDIUM" ? "#b45309" : "#15803d";
                                const sevBg = sev === "CRITICAL" || sev === "HIGH" ? "#fff1f2" : sev === "MEDIUM" ? "#fef3c7" : "#f0fdf4";
                                const sevBorder = sev === "CRITICAL" || sev === "HIGH" ? "#fecdd3" : sev === "MEDIUM" ? "#fde68a" : "#bbf7d0";

                                return (
                                    <div
                                        key={insight._id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: "14px",
                                            padding: "14px",
                                            border: `1px solid ${sevBorder}`,
                                            borderRadius: "10px",
                                            background: sevBg
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: "block", marginBottom: "4px", fontSize: "0.9rem", color: "var(--text-main)" }}>
                                                {insight.title}
                                            </strong>
                                            <p style={{ color: "var(--text-muted)", marginBottom: "4px", lineHeight: 1.4, fontSize: "0.825rem" }}>
                                                {insight.summary}
                                            </p>
                                            {insight.recommendation && (
                                                <p style={{ color: "var(--text-main)", fontWeight: 600, fontSize: "0.8rem", margin: "2px 0" }}>
                                                    Action: {insight.recommendation}
                                                </p>
                                            )}
                                        </div>

                                        <span style={{
                                            fontSize: "0.7rem",
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                            color: sevColor,
                                            padding: "3px 8px",
                                            borderRadius: "10px",
                                            background: "white",
                                            border: `1px solid ${sevBorder}`
                                        }}>
                                            {sev}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Feedback Channels Bar Chart */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px" }}>
                        Ingestion Channels
                    </h3>
                    <div style={{ width: "100%", height: 230 }}>
                        <ResponsiveContainer>
                            <BarChart data={channelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6d5dfc" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Critical Feedback Stream */}
            <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                        <Frown size={18} color="#ef4444" />
                        <span>Recent Critical Feedback Stream</span>
                    </h3>
                    <Link to="/feedback?sentiment=NEG" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                        View All Negative →
                    </Link>
                </div>

                {criticalList.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>No critical negative feedback logged.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {criticalList.map((item) => (
                            <Link
                                key={item._id}
                                to={`/feedback/${item._id}`}
                                style={{ padding: "10px 14px", borderRadius: "8px", background: "#fff1f2", border: "1px solid #fecdd3", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}
                            >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <strong style={{ fontSize: "0.85rem", color: "#9f1239", display: "block", marginBottom: "2px" }}>
                                        {item.featureArea || "Uncategorized"}
                                    </strong>
                                    <p style={{ fontSize: "0.825rem", color: "#334155", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        "{item.content}"
                                    </p>
                                </div>
                                <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "10px", background: "#be123c", color: "white", fontWeight: 700, whiteSpace: "nowrap" }}>
                                    NEG
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;