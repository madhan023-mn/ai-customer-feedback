import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
    Layers,
    Smile,
    Meh,
    Frown,
    AlertTriangle,
    Loader2,
    ArrowUpRight
} from "lucide-react";

function Themes() {
    const [themes, setThemes] = useState([]);
    const [spikingThemes, setSpikingThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadThemes() {
        try {
            setLoading(true);
            const response = await api.get("/themes");
            setThemes(response.data.themes || []);
            setSpikingThemes(response.data.spikingThemes || []);
        } catch (err) {
            console.error("Load themes error:", err);
            setError(err.response?.data?.message || "Failed to load themes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadThemes();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading-spinner" style={{ gap: "10px" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Analyzing themes and feature clusters...</span>
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
        <div className="themes-page">
            <div className="themes-header">
                <div>
                    <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Layers size={26} color="var(--primary)" />
                        <span>Theme Explorer</span>
                    </h1>
                    <p className="page-subtitle">
                        Explore customer feedback clusters, frequency, and sentiment distribution across feature areas.
                    </p>
                </div>
            </div>

            {/* Spiking Themes Alert Banner */}
            {spikingThemes.length > 0 && (
                <div style={{
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px"
                }}>
                    <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <strong style={{ color: "#dc2626", fontSize: "0.95rem", display: "block" }}>
                            🔥 Spiking AI Themes Alert ({spikingThemes.length} themes expanding rapidly)
                        </strong>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            High negative sentiment or feedback volume spikes detected in: {spikingThemes.map(t => `${t._id || t.name} (+${t.spikePercentage || 50}%)`).join(", ")}.
                        </span>
                    </div>
                </div>
            )}

            {themes.length === 0 ? (
                <div className="empty-state">
                    <h2>No Themes Discovered Yet</h2>
                    <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                        Run AI analysis on customer feedback entries to cluster them into feature themes.
                    </p>
                    <Link to="/feedback" className="btn-primary" style={{ marginTop: "16px", display: "inline-flex" }}>
                        Go to Feedback Hub
                    </Link>
                </div>
            ) : (
                <div className="theme-grid">
                    {themes.map((theme) => {
                        const themeName = theme._id || theme.name || "General";
                        return (
                            <Link
                                key={themeName}
                                to={`/themes/${encodeURIComponent(themeName)}`}
                                className="theme-card"
                                style={{ position: "relative" }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                                                {themeName}
                                            </h2>
                                            {theme.isSpiking && (
                                                <span style={{
                                                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                                                    color: "#dc2626",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 800,
                                                    padding: "2px 8px",
                                                    borderRadius: "12px"
                                                }}>
                                                    🔥 +{theme.spikePercentage || 50}%
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
                                            {theme.frequency} total feedback items
                                        </p>
                                    </div>
                                    <ArrowUpRight size={18} color="var(--text-muted)" />
                                </div>

                                <div style={{
                                    margin: "12px 0",
                                    padding: "8px 12px",
                                    backgroundColor: "var(--bg-subtle, rgba(255,255,255,0.04))",
                                    borderRadius: "8px",
                                    display: "flex",
                                    justify: "space-between",
                                    fontSize: "0.8rem"
                                }}>
                                    <span>This Month: <strong>{theme.thisMonth || theme.frequency}</strong></span>
                                    <span style={{ color: "var(--text-muted)" }}>Prev Month: <strong>{theme.previousMonth || 0}</strong></span>
                                </div>

                                <div className="theme-stats">
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#16a34a" }}>
                                        <Smile size={14} />
                                        <span>Positive: <strong>{theme.positive}</strong></span>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748b" }}>
                                        <Meh size={14} />
                                        <span>Neutral: <strong>{theme.neutral}</strong></span>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#dc2626" }}>
                                        <Frown size={14} />
                                        <span>Negative: <strong>{theme.negative}</strong></span>
                                    </div>
                                </div>

                                <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Negative Risk</span>
                                    <strong style={{
                                        color: Number(theme.negativePercentage) > 50 ? "#dc2626" : Number(theme.negativePercentage) > 25 ? "#d97706" : "#16a34a",
                                        fontSize: "0.95rem"
                                    }}>
                                        {Number(theme.negativePercentage || 0).toFixed(1)}% negative
                                    </strong>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


export default Themes;
