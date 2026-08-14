import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    Sparkles,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    Calendar,
    Lightbulb
} from "lucide-react";

function Insights() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadInsights() {
        try {
            setLoading(true);
            const response = await api.get("/insights");
            setInsights(response.data.insights || []);
        } catch (err) {
            console.error("Load insights error:", err);
            setError(err.response?.data?.message || "Failed to load insights");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInsights();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading-spinner" style={{ gap: "10px" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Gathering product intelligence & AI insights...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content">
                <div className="alert-error">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="insights-page">
            <div className="insights-header">
                <div>
                    <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Sparkles size={26} color="var(--primary)" />
                        <span>AI Product Insights</span>
                    </h1>
                    <p className="page-subtitle">
                        Actionable patterns, trends, and product recommendations generated automatically from customer feedback.
                    </p>
                </div>
            </div>

            {insights.length === 0 ? (
                <div className="empty-state">
                    <Lightbulb size={36} color="var(--primary)" style={{ marginBottom: "12px" }} />
                    <h2>No Insights Generated Yet</h2>
                    <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                        Navigate to Theme Explorer and select a feature theme to generate actionable AI insights.
                    </p>
                </div>
            ) : (
                <div className="insight-grid">
                    {insights.map((insight) => (
                        <div key={insight._id} className="insight-card">
                            <div className="insight-top">
                                <span className="badge badge-channel" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                                    {insight.theme}
                                </span>
                                <strong className={`badge ${
                                    insight.priority === "HIGH" ? "badge-neg" :
                                    insight.priority === "MEDIUM" ? "badge-neu" : "badge-pos"
                                }`} style={{ padding: "4px 10px", fontSize: "0.8rem" }}>
                                    {insight.priority} PRIORITY
                                </strong>
                            </div>

                            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "10px 0", color: "var(--text-main)" }}>
                                {insight.title}
                            </h2>

                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                {insight.summary}
                            </p>

                            <div className="recommendation">
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 700, marginBottom: "6px" }}>
                                    <CheckCircle2 size={16} />
                                    <span>Recommended Action</span>
                                </div>
                                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                                    {insight.recommendation}
                                </p>
                            </div>

                            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                <Calendar size={13} />
                                <span>Generated on {new Date(insight.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Insights;
