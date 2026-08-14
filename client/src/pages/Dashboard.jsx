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
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import {
    MessageSquare,
    Smile,
    Meh,
    Frown,
    PlusCircle,
    ArrowRight,
    AlertCircle,
    Loader2,
    BarChart3,
    Layers,
    Cpu,
    Sparkles
} from "lucide-react";

const SENTIMENT_COLORS = {
    POS: "#22c55e",
    NEU: "#94a3b8",
    NEG: "#ef4444"
};

function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            setLoading(true);
            const response = await api.get("/dashboard/analytics");
            setData(response.data);
        } catch (err) {
            console.error("Fetch dashboard error:", err);
            setError(err.response?.data?.message || "Failed to load dashboard analytics");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading-spinner" style={{ gap: "10px" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Loading analytics dashboard...</span>
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
                </div>
            </div>
        );
    }

    const totalFeedback = data?.totalFeedback || data?.total || 0;
    const positive = data?.sentiment?.POS || 0;
    const neutral = data?.sentiment?.NEU || 0;
    const negative = data?.sentiment?.NEG || 0;
    const newCount = data?.status?.NEW || 0;
    const pendingAi = data?.pendingAi || 0;
    const failedAi = data?.failedAi || 0;

    const sentimentData = [
        { name: "Positive", value: positive, color: "#22c55e" },
        { name: "Neutral", value: neutral, color: "#94a3b8" },
        { name: "Negative", value: negative, color: "#ef4444" }
    ].filter(item => item.value > 0);

    const channelData = Array.isArray(data?.channelStats)
        ? data.channelStats.map(item => ({ name: item._id, count: item.count }))
        : Object.keys(data?.channels || {}).map(key => ({ name: key, count: data.channels[key] }));

    const featureData = Array.isArray(data?.featureStats)
        ? data.featureStats.map(item => ({ name: item._id, count: item.count }))
        : [];

    const statusData = Array.isArray(data?.statusStats)
        ? data.statusStats.map(item => ({ name: item._id, count: item.count }))
        : Object.keys(data?.status || {}).map(key => ({ name: key, count: data.status[key] }));

    const trendData = Array.isArray(data?.feedbackTrend)
        ? data.feedbackTrend.map(item => ({ date: item._id, count: item.count }))
        : [];

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Welcome back, {user?.name || "User"}
                    </h1>
                    <p className="page-subtitle">
                        Workspace: <strong>{user?.workspace}</strong> • Role: <strong>{user?.role}</strong>
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/ask" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                        <Sparkles size={16} />
                        <span>Ask LOOP Q&A</span>
                    </Link>
                    <Link to="/themes" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Layers size={16} />
                        <span>Theme Explorer</span>
                    </Link>
                    <Link to="/feedback/add" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <PlusCircle size={16} />
                        <span>New Feedback</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Feedback</span>
                        <div className="stat-icon icon-purple">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{totalFeedback}</div>
                    <div className="stat-subtext">Across all channels</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Positive</span>
                        <div className="stat-icon icon-green">
                            <Smile size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{positive}</div>
                    <div className="stat-subtext">Satisfaction entries</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Neutral</span>
                        <div className="stat-icon icon-blue">
                            <Meh size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{neutral}</div>
                    <div className="stat-subtext">Neutral entries</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Negative</span>
                        <div className="stat-icon icon-amber">
                            <Frown size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{negative}</div>
                    <div className="stat-subtext">Critical issues</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">AI Pending</span>
                        <div className="stat-icon icon-blue">
                            <Cpu size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{pendingAi}</div>
                    <div className="stat-subtext">Awaiting processing</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">AI Failed</span>
                        <div className="stat-icon icon-amber">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{failedAi}</div>
                    <div className="stat-subtext">Needs retry</div>
                </div>
            </div>

            {/* Visual Analytics Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginTop: "24px" }}>
                {/* Sentiment Pie Chart */}
                <div className="table-card" style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <BarChart3 size={18} color="var(--primary)" />
                        Sentiment Breakdown
                    </h3>
                    <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={85}
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
                <div className="table-card" style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                        Feedback Channels
                    </h3>
                    <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer>
                            <BarChart data={channelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Feature Areas & Trend */}
            {featureData.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginTop: "20px" }}>
                    <div className="table-card" style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                            Top Feature Areas
                        </h3>
                        <div style={{ width: "100%", height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart data={featureData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="table-card" style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                            Status Distribution
                        </h3>
                        <div style={{ width: "100%", height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Processing Queue & Recent Critical Feedback */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {/* AI Processing Status */}
                <div className="table-card" style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Cpu size={18} color="var(--primary)" />
                        <span>AI Processing Queue Status</span>
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                        <div style={{ padding: "14px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <span style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>Completed</span>
                            <strong style={{ fontSize: "1.5rem", display: "block", color: "#15803d", marginTop: "4px" }}>
                                {data?.aiQueue?.COMPLETED ?? (totalFeedback - pendingAi - failedAi)}
                            </strong>
                        </div>
                        <div style={{ padding: "14px", borderRadius: "10px", background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                            <span style={{ fontSize: "0.8rem", color: "#3730a3", fontWeight: 600 }}>Pending</span>
                            <strong style={{ fontSize: "1.5rem", display: "block", color: "#4f46e5", marginTop: "4px" }}>
                                {data?.aiQueue?.PENDING ?? pendingAi}
                            </strong>
                        </div>
                        <div style={{ padding: "14px", borderRadius: "10px", background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                            <span style={{ fontSize: "0.8rem", color: "#0369a1", fontWeight: 600 }}>Processing</span>
                            <strong style={{ fontSize: "1.5rem", display: "block", color: "#0284c7", marginTop: "4px" }}>
                                {data?.aiQueue?.PROCESSING ?? 0}
                            </strong>
                        </div>
                        <div style={{ padding: "14px", borderRadius: "10px", background: "#fff1f2", border: "1px solid #fecdd3" }}>
                            <span style={{ fontSize: "0.8rem", color: "#9f1239", fontWeight: 600 }}>Failed</span>
                            <strong style={{ fontSize: "1.5rem", display: "block", color: "#be123c", marginTop: "4px" }}>
                                {data?.aiQueue?.FAILED ?? failedAi}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Recent Critical Feedback Stream */}
                <div className="table-card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <Frown size={18} color="#ef4444" />
                            <span>Recent Critical Feedback</span>
                        </h3>
                        <Link to="/feedback?sentiment=NEG" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                            View All →
                        </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {Array.isArray(data?.recentCritical) && data.recentCritical.length > 0 ? (
                            data.recentCritical.map(item => (
                                <Link
                                    key={item._id}
                                    to={`/feedback/${item._id}`}
                                    style={{ padding: "10px 14px", borderRadius: "8px", background: "#fff1f2", border: "1px solid #fecdd3", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}
                                >
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#9f1239", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            "{item.content}"
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "#be123c", marginTop: "2px" }}>
                                            {item.featureArea || "General"} • {item.channel}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "10px", background: "#be123c", color: "white", fontWeight: 700 }}>
                                        {item.sentiment}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                No recent critical feedback items.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;