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
    RefreshCw
} from "lucide-react";

function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

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
        { name: "Positive", value: posCount, color: "#22c55e" },
        { name: "Neutral", value: neuCount, color: "#94a3b8" },
        { name: "Negative", value: negCount, color: "#ef4444" }
    ].filter(item => item.value > 0);

    const channelData = Array.isArray(data?.channelStats)
        ? data.channelStats.map(item => ({ name: item._id, count: item.count }))
        : Object.keys(data?.channels || {}).map(key => ({ name: key, count: data.channels[key] }));

    const maxThemeCount = topThemes.length > 0 ? Math.max(...topThemes.map(t => t.count)) : 1;

    return (
        <div className="main-content">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 className="page-title">
                        LOOP Dashboard
                    </h1>
                    <p className="page-subtitle">
                        Customer feedback intelligence at a glance. Workspace: <strong>{user?.workspace}</strong>
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                        className="btn-secondary"
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <RefreshCw size={16} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <Link to="/ask" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(99, 102, 241, 0.08)", color: "var(--primary)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                        <Sparkles size={16} />
                        <span>Ask LOOP Q&A</span>
                    </Link>

                    <Link to="/feedback/add" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <PlusCircle size={16} />
                        <span>New Feedback</span>
                    </Link>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "2rem" }}>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Feedback</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#f3e8ff", color: "#9333ea" }}>
                            <MessageSquare size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>{totalFeedback}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>Across all channels</div>
                </div>

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 600 }}>Positive</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#dcfce7", color: "#16a34a" }}>
                            <Smile size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#15803d" }}>{posPct}%</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>{posCount} entries</div>
                </div>

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 600 }}>Neutral</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#f1f5f9", color: "#64748b" }}>
                            <Meh size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#475569" }}>{neuPct}%</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>{neuCount} entries</div>
                </div>

                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="stat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#9f1239", fontWeight: 600 }}>Negative</span>
                        <div style={{ padding: "8px", borderRadius: "8px", background: "#ffe4e6", color: "#e11d48" }}>
                            <Frown size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#be123c" }}>{negPct}%</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "4px" }}>{negCount} entries</div>
                </div>
            </div>

            {/* Visual Charts & Stats Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Sentiment Pie Chart */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <BarChart3 size={18} color="var(--primary)" />
                        <span>Sentiment Breakdown</span>
                    </h3>
                    <div style={{ width: "100%", height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
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

                {/* Channel Bar Chart */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                        Feedback Channels
                    </h3>
                    <div style={{ width: "100%", height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={channelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Themes & AI Processing Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Top Themes Card */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
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
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {topThemes.map((theme) => {
                                const themeName = theme._id || theme.name || "Uncategorized";
                                const themeCount = theme.count || 0;
                                const pct = maxThemeCount ? Math.round((themeCount / maxThemeCount) * 100) : 0;
                                return (
                                    <div key={themeName} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
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

                {/* AI Processing Card */}
                <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Cpu size={18} color="var(--primary)" />
                        <span>AI Processing Summary</span>
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                        <div style={{ padding: "14px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <span style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>Completed</span>
                            <strong style={{ fontSize: "1.6rem", display: "block", color: "#15803d", marginTop: "4px" }}>
                                {aiProcessing.COMPLETED ?? 0}
                            </strong>
                        </div>

                        <div style={{ padding: "14px", borderRadius: "10px", background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                            <span style={{ fontSize: "0.8rem", color: "#3730a3", fontWeight: 600 }}>Pending</span>
                            <strong style={{ fontSize: "1.6rem", display: "block", color: "#4f46e5", marginTop: "4px" }}>
                                {aiProcessing.PENDING ?? 0}
                            </strong>
                        </div>

                        <div style={{ padding: "14px", borderRadius: "10px", background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                            <span style={{ fontSize: "0.8rem", color: "#0369a1", fontWeight: 600 }}>Processing</span>
                            <strong style={{ fontSize: "1.6rem", display: "block", color: "#0284c7", marginTop: "4px" }}>
                                {aiProcessing.PROCESSING ?? 0}
                            </strong>
                        </div>

                        <div style={{ padding: "14px", borderRadius: "10px", background: "#fff1f2", border: "1px solid #fecdd3" }}>
                            <span style={{ fontSize: "0.8rem", color: "#9f1239", fontWeight: 600 }}>Failed</span>
                            <strong style={{ fontSize: "1.6rem", display: "block", color: "#be123c", marginTop: "4px" }}>
                                {aiProcessing.FAILED ?? 0}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Critical Feedback Stream */}
            <div className="table-card" style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                        <Frown size={18} color="#ef4444" />
                        <span>Recent Critical Feedback</span>
                    </h3>
                    <Link to="/feedback?sentiment=NEG" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                        View All Negative →
                    </Link>
                </div>

                {criticalList.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>No critical feedback found.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {criticalList.map((item) => (
                            <Link
                                key={item._id}
                                to={`/feedback/${item._id}`}
                                style={{ padding: "12px 16px", borderRadius: "8px", background: "#fff1f2", border: "1px solid #fecdd3", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}
                            >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <strong style={{ fontSize: "0.875rem", color: "#9f1239", display: "block", marginBottom: "2px" }}>
                                        {item.featureArea || "Uncategorized"}
                                    </strong>
                                    <p style={{ fontSize: "0.85rem", color: "#334155", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        "{item.content}"
                                    </p>
                                </div>
                                <span style={{ fontSize: "0.725rem", padding: "3px 10px", borderRadius: "12px", background: "#be123c", color: "white", fontWeight: 700, whiteSpace: "nowrap" }}>
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