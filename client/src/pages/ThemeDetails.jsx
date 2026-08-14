import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import {
    ArrowLeft,
    Smile,
    Meh,
    Frown,
    AlertCircle,
    Loader2,
    MessageSquare,
    Sparkles,
    TrendingUp,
    TrendingDown,
    Minus,
    CheckCircle2,
    Quote,
    User,
    Calendar,
    ArrowUpRight
} from "lucide-react";

function ThemeDetails() {
    const { theme } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // AI Insight Generation States
    const [generatingInsight, setGeneratingInsight] = useState(false);
    const [insightMessage, setInsightMessage] = useState("");
    const [latestInsight, setLatestInsight] = useState(null);

    async function loadTheme() {
        try {
            setLoading(true);
            const response = await api.get(`/themes/${encodeURIComponent(theme)}`);
            setData(response.data);
        } catch (err) {
            console.error("Load theme error:", err);
            setError(err.response?.data?.message || "Failed to load theme details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTheme();
    }, [theme]);

    async function handleGenerateInsight() {
        try {
            setGeneratingInsight(true);
            setInsightMessage("");
            const response = await api.post(`/insights/theme/${encodeURIComponent(theme)}/generate`);
            setLatestInsight(response.data.insight);
            setInsightMessage(`Insight Generated: "${response.data.insight.title}"`);
        } catch (err) {
            setInsightMessage(err.response?.data?.message || "Failed to generate AI insight");
        } finally {
            setGeneratingInsight(false);
        }
    }

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading-spinner" style={{ gap: "10px" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Loading theme analytics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content">
                <Link to="/themes" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <ArrowLeft size={16} />
                    <span>Back to Themes</span>
                </Link>
                <div className="alert-error" style={{ marginTop: "1rem" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const sentiment = data?.sentiment || { positive: 0, neutral: 0, negative: 0 };
    const negRate = Number(data?.negativePercentage || 0).toFixed(1);
    const trendDirection = data?.trendDirection || "STABLE";

    return (
        <div className="theme-details-page">
            <Link to="/themes" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "var(--text-muted)", marginBottom: "20px" }}>
                <ArrowLeft size={16} />
                <span>Back to Themes</span>
            </Link>

            <div className="theme-details-header">
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                        <h1 className="page-title" style={{ margin: 0 }}>{data.theme} Theme</h1>
                        <span className="trend-badge" style={{
                            backgroundColor: trendDirection === "INCREASING" ? "rgba(239, 68, 68, 0.1)" : trendDirection === "DECREASING" ? "rgba(34, 197, 94, 0.1)" : "#f1f5f9",
                            color: trendDirection === "INCREASING" ? "#dc2626" : trendDirection === "DECREASING" ? "#16a34a" : "#475467",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                        }}>
                            {trendDirection === "INCREASING" ? <TrendingUp size={14} /> :
                             trendDirection === "DECREASING" ? <TrendingDown size={14} /> : <Minus size={14} />}
                            <span>{trendDirection === "INCREASING" ? "↑ Increasing" : trendDirection === "DECREASING" ? "↓ Decreasing" : "→ Stable"}</span>
                        </span>
                    </div>
                    <p className="page-subtitle">
                        {data.frequency} total feedback records analyzed in this feature cluster.
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                        className="btn-primary"
                        onClick={handleGenerateInsight}
                        disabled={generatingInsight}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <Sparkles size={16} />
                        <span>{generatingInsight ? "Generating..." : "Generate AI Insight"}</span>
                    </button>

                    <div className="negative-rate">
                        <strong>{negRate}%</strong>
                        <span>Negative Ratio</span>
                    </div>
                </div>
            </div>

            {insightMessage && (
                <div className="alert-success" style={{ marginBottom: "20px", padding: "12px 16px", backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366f1", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.2)", fontSize: "0.9rem" }}>
                    {insightMessage}
                </div>
            )}

            {/* Generated / AI Insight Banner */}
            {(latestInsight || data) && (
                <div style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "25px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start"
                }}>
                    <Sparkles size={22} color="#6366f1" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ width: "100%" }}>
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", color: "var(--text-main)", fontWeight: 700 }}>
                            {latestInsight ? latestInsight.title : "AI Theme Recommendation"}
                        </h4>
                        <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                            {latestInsight ? latestInsight.summary : (
                                Number(negRate) > 50
                                    ? `High concentration of critical user friction detected in ${data.theme}. Prioritize technical bug fixes and workflow improvements for this feature.`
                                    : Number(negRate) > 25
                                    ? `Moderate friction in ${data.theme}. Review customer rationale to address recurring usability pain points.`
                                    : `Strong user sentiment for ${data.theme}. Maintain feature stability and document positive user feedback patterns.`
                            )}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
                            <CheckCircle2 size={14} />
                            <span>Recommended Action: {latestInsight ? latestInsight.recommendation : `Investigate ${data.theme} performance and user report patterns.`}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Sentiment Cards */}
            <div className="theme-sentiment-grid">
                <div className="theme-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a" }}>
                        <Smile size={18} />
                        <span>Positive Feedback</span>
                    </div>
                    <strong>{sentiment.positive}</strong>
                </div>

                <div className="theme-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b" }}>
                        <Meh size={18} />
                        <span>Neutral Feedback</span>
                    </div>
                    <strong>{sentiment.neutral}</strong>
                </div>

                <div className="theme-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626" }}>
                        <Frown size={18} />
                        <span>Negative Feedback</span>
                    </div>
                    <strong>{sentiment.negative}</strong>
                </div>
            </div>

            {/* Trend Chart */}
            {Array.isArray(data.trend) && data.trend.length > 0 && (
                <div className="theme-chart-card">
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                        Feedback Trend Over Time
                    </h2>
                    <div style={{ width: "100%", height: 280 }}>
                        <ResponsiveContainer>
                            <LineChart data={data.trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Recent Feedback Quotes */}
            <div className="theme-feedback-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" }}>
                            <Quote size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Recent Customer Quotes</h2>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                                Direct verbatim customer feedback in the {data.theme} cluster
                            </p>
                        </div>
                    </div>
                </div>

                {(!data.feedback || data.feedback.length === 0) ? (
                    <div className="empty-state" style={{ padding: "2rem", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                        <p>No customer quotes recorded for this theme yet.</p>
                    </div>
                ) : (
                    <div className="quotes-grid">
                        {data.feedback.map((item) => (
                            <div
                                key={item._id}
                                className={`quote-card sentiment-border-${item.sentiment ? item.sentiment.toLowerCase() : "neu"}`}
                            >
                                <div className="quote-header">
                                    <div className="quote-user-info">
                                        <div className="user-avatar-small">
                                            {item.customerLabel ? item.customerLabel.charAt(0).toUpperCase() : <User size={14} />}
                                        </div>
                                        <span className="customer-name">{item.customerLabel || "Customer"}</span>
                                    </div>

                                    <div className="quote-header-right">
                                        <span className={`badge ${
                                            item.sentiment === "POS" ? "badge-pos" :
                                            item.sentiment === "NEG" ? "badge-neg" : "badge-neu"
                                        }`}>
                                            {item.sentiment === "POS" ? <Smile size={13} /> :
                                             item.sentiment === "NEG" ? <Frown size={13} /> : <Meh size={13} />}
                                            <span>{item.sentiment}</span>
                                        </span>

                                        <Link to={`/feedback/${item._id}`} className="quote-link-btn" title="View Full Details">
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>

                                <blockquote className="quote-text">
                                    "{item.content}"
                                </blockquote>

                                {item.rationale && (
                                    <div className="quote-rationale">
                                        <Sparkles size={14} color="#6366f1" style={{ flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <strong>AI Insight:</strong> {item.rationale}
                                        </div>
                                    </div>
                                )}

                                <div className="quote-footer">
                                    <span className="badge badge-channel">{item.channel}</span>
                                    <span className="badge badge-neu">{item.status}</span>
                                    {item.createdAt && (
                                        <span className="quote-date">
                                            <Calendar size={12} />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ThemeDetails;
