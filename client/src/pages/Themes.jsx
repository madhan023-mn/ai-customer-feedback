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
    ArrowUpRight,
    Flame,
    TrendingUp,
    TrendingDown,
    Minus,
    Search,
    ShieldAlert,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    Sparkles,
    BarChart3
} from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";

function formatPercentChange(percent) {
    if (typeof percent !== "number" || isNaN(percent)) {
        return { formatted: "0%", label: "0% vs previous month", isUp: false, isDown: false };
    }
    if (percent > 0) {
        return {
            formatted: `+${percent}%`,
            label: `↑ +${percent}% vs previous month`,
            isUp: true,
            isDown: false
        };
    } else if (percent < 0) {
        const absVal = Math.abs(percent);
        return {
            formatted: `−${absVal}%`,
            label: `↓ −${absVal}% vs previous month`,
            isUp: false,
            isDown: true
        };
    }
    return { formatted: "0%", label: "0% vs previous month", isUp: false, isDown: false };
}

function Themes() {
    const [themes, setThemes] = useState([]);
    const [spikingThemes, setSpikingThemes] = useState([]);
    const [summary, setSummary] = useState({
        totalThemes: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL"); // ALL, HIGH, MEDIUM, LOW, SPIKING

    async function loadThemes() {
        try {
            setLoading(true);
            const response = await api.get("/themes");
            const themeList = response.data.themes || [];
            setThemes(themeList);
            setSpikingThemes(response.data.spikingThemes || []);
            setSummary(response.data.summary || {
                totalThemes: themeList.length,
                highPriority: themeList.filter(t => t.priority === "HIGH").length,
                mediumPriority: themeList.filter(t => t.priority === "MEDIUM").length,
                lowPriority: themeList.filter(t => t.priority === "LOW").length
            });
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

    // Filter themes by search & priority filter
    const filteredThemes = themes.filter((theme) => {
        const themeName = (theme._id || theme.name || "").toLowerCase();
        const featureArea = (theme.featureArea || "").toLowerCase();
        const matchesSearch = themeName.includes(search.toLowerCase()) || featureArea.includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (priorityFilter === "ALL") return true;
        if (priorityFilter === "SPIKING") return theme.isSpiking;
        return theme.priority === priorityFilter;
    });

    if (loading) {
        return (
            <div className="themes-page">
                <LoadingScreen
                    title="Analyzing Theme Intelligence..."
                    subtitle="Clustering feedback topics, calculating priority metrics & tracking volume trends"
                    minHeight="60vh"
                />
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
            {/* Page Header */}
            <div className="themes-header" style={{ marginBottom: "1.5rem" }}>
                <div>
                    <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Layers size={26} color="var(--primary)" />
                        <span>Theme Explorer</span>
                    </h1>
                    <p className="page-subtitle">
                        Actionable feedback clusters ranked by priority, customer complaint risk, and growth trends.
                    </p>
                </div>

                <Link to="/feedback" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <MessageSquare size={16} />
                    <span>View All Feedback</span>
                </Link>
            </div>

            {/* Top Summary Metrics Banner */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "14px",
                    marginBottom: "1.5rem"
                }}
            >
                {/* Total Themes */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Layers size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Total Themes
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.15 }}>
                            {summary.totalThemes || themes.length}
                        </div>
                    </div>
                </div>

                {/* High Priority 🔴 */}
                <div
                    onClick={() => setPriorityFilter(priorityFilter === "HIGH" ? "ALL" : "HIGH")}
                    style={{
                        background: priorityFilter === "HIGH" ? "rgba(239, 68, 68, 0.08)" : "#ffffff",
                        border: priorityFilter === "HIGH" ? "1px solid #ef4444" : "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(239, 68, 68, 0.12)",
                            color: "#dc2626",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <ShieldAlert size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "#b91c1c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "4px" }}>
                            <ShieldAlert size={14} />
                            <span>High Priority</span>
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#dc2626", lineHeight: 1.15 }}>
                            {summary.highPriority}
                        </div>
                    </div>
                </div>

                {/* Medium Priority */}
                <div
                    onClick={() => setPriorityFilter(priorityFilter === "MEDIUM" ? "ALL" : "MEDIUM")}
                    style={{
                        background: priorityFilter === "MEDIUM" ? "rgba(245, 158, 11, 0.08)" : "#ffffff",
                        border: priorityFilter === "MEDIUM" ? "1px solid #f59e0b" : "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(245, 158, 11, 0.12)",
                            color: "#d97706",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <AlertCircle size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "#b45309", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={14} />
                            <span>Medium Priority</span>
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#d97706", lineHeight: 1.15 }}>
                            {summary.mediumPriority}
                        </div>
                    </div>
                </div>

                {/* Low Priority */}
                <div
                    onClick={() => setPriorityFilter(priorityFilter === "LOW" ? "ALL" : "LOW")}
                    style={{
                        background: priorityFilter === "LOW" ? "rgba(16, 185, 129, 0.08)" : "#ffffff",
                        border: priorityFilter === "LOW" ? "1px solid #10b981" : "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "#16a34a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={14} />
                            <span>Low Priority</span>
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#16a34a", lineHeight: 1.15 }}>
                            {summary.lowPriority}
                        </div>
                    </div>
                </div>
            </div>

            {/* Spiking Themes Alert Banner (if any) */}
            {spikingThemes.length > 0 && (
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >
                    <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <strong style={{ color: "#dc2626", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Flame size={16} />
                            <span>Spiking Issues Detected ({spikingThemes.length} active spikes)</span>
                        </strong>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            High negative sentiment or complaints increasing rapidly in: {spikingThemes.map(t => `${t._id || t.name} (${formatPercentChange(t.percentChange).formatted})`).join(", ")}.
                        </span>
                    </div>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
                {/* Priority Filter Presets */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                        type="button"
                        className="badge"
                        style={{
                            cursor: "pointer",
                            background: priorityFilter === "ALL" ? "var(--primary)" : "white",
                            color: priorityFilter === "ALL" ? "white" : "var(--text-main)",
                            border: "1px solid var(--border-light)",
                            padding: "6px 14px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                        onClick={() => setPriorityFilter("ALL")}
                    >
                        <Layers size={14} />
                        <span>All Themes ({themes.length})</span>
                    </button>
                    <button
                        type="button"
                        className="badge"
                        style={{
                            cursor: "pointer",
                            background: priorityFilter === "HIGH" ? "#ef4444" : "#fff1f2",
                            color: priorityFilter === "HIGH" ? "white" : "#be123c",
                            border: "1px solid #fecdd3",
                            padding: "6px 14px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                        onClick={() => setPriorityFilter("HIGH")}
                    >
                        <ShieldAlert size={14} />
                        <span>High Priority ({summary.highPriority})</span>
                    </button>
                    <button
                        type="button"
                        className="badge"
                        style={{
                            cursor: "pointer",
                            background: priorityFilter === "MEDIUM" ? "#f59e0b" : "#fffbeb",
                            color: priorityFilter === "MEDIUM" ? "white" : "#b45309",
                            border: "1px solid #fde68a",
                            padding: "6px 14px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                        onClick={() => setPriorityFilter("MEDIUM")}
                    >
                        <AlertCircle size={14} />
                        <span>Medium Priority ({summary.mediumPriority})</span>
                    </button>
                    <button
                        type="button"
                        className="badge"
                        style={{
                            cursor: "pointer",
                            background: priorityFilter === "LOW" ? "#10b981" : "#f0fdf4",
                            color: priorityFilter === "LOW" ? "white" : "#15803d",
                            border: "1px solid #bbf7d0",
                            padding: "6px 14px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                        onClick={() => setPriorityFilter("LOW")}
                    >
                        <CheckCircle2 size={14} />
                        <span>Low Priority ({summary.lowPriority})</span>
                    </button>
                    {spikingThemes.length > 0 && (
                        <button
                            type="button"
                            className="badge"
                            style={{
                                cursor: "pointer",
                                background: priorityFilter === "SPIKING" ? "#dc2626" : "#fff1f2",
                                color: priorityFilter === "SPIKING" ? "white" : "#991b1b",
                                border: "1px solid #fca5a5",
                                padding: "6px 14px",
                                fontSize: "0.82rem",
                                fontWeight: 600,
                                borderRadius: "20px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                            }}
                            onClick={() => setPriorityFilter("SPIKING")}
                        >
                            <Flame size={14} />
                            <span>Spiking ({spikingThemes.length})</span>
                        </button>
                    )}
                </div>

                {/* Search Input */}
                <div style={{ position: "relative", minWidth: "260px" }}>
                    <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        type="text"
                        placeholder="Search themes or features..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px 8px 36px",
                            borderRadius: "10px",
                            border: "1px solid var(--border-light)",
                            fontSize: "0.85rem",
                            outline: "none",
                            background: "#ffffff"
                        }}
                    />
                </div>
            </div>

            {/* Themes Grid */}
            {filteredThemes.length === 0 ? (
                <div className="empty-state" style={{ background: "#ffffff", padding: "3rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                    <h2>No Themes Found</h2>
                    <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                        {search || priorityFilter !== "ALL"
                            ? "No themes match the selected filter or search query."
                            : "Run AI analysis on customer feedback entries to cluster them into actionable themes."}
                    </p>
                    <button
                        className="btn-secondary"
                        onClick={() => { setSearch(""); setPriorityFilter("ALL"); }}
                        style={{ marginTop: "16px" }}
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="theme-grid">
                    {filteredThemes.map((theme) => {
                        const themeName = theme._id || theme.name || "General";
                        const trend = formatPercentChange(theme.percentChange);
                        const isHighPriority = theme.priority === "HIGH";
                        const isMedPriority = theme.priority === "MEDIUM";

                        return (
                            <div
                                key={themeName}
                                className="theme-card"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderRadius: "14px",
                                    padding: "20px",
                                    background: "#ffffff",
                                    border: isHighPriority
                                        ? "1px solid rgba(239, 68, 68, 0.35)"
                                        : isMedPriority
                                        ? "1px solid rgba(245, 158, 11, 0.3)"
                                        : "1px solid var(--border-light)",
                                    boxShadow: isHighPriority
                                        ? "0 4px 14px rgba(239, 68, 68, 0.08)"
                                        : "0 2px 8px rgba(0, 0, 0, 0.03)",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                            >
                                <div>
                                    {/* Card Top: Theme Title & Priority Badge */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                {isHighPriority ? (
                                                    <ShieldAlert size={18} color="#dc2626" />
                                                ) : isMedPriority ? (
                                                    <AlertCircle size={18} color="#d97706" />
                                                ) : (
                                                    <CheckCircle2 size={18} color="#16a34a" />
                                                )}
                                                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
                                                    {themeName}
                                                </h2>
                                                {theme.isSpiking && (
                                                    <span
                                                        style={{
                                                            backgroundColor: "rgba(239, 68, 68, 0.12)",
                                                            color: "#dc2626",
                                                            fontSize: "0.72rem",
                                                            fontWeight: 800,
                                                            padding: "2px 8px",
                                                            borderRadius: "12px",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}
                                                    >
                                                        <Flame size={12} />
                                                        <span>Spiking</span>
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                                                Feature: <strong>{theme.featureArea || "General"}</strong>
                                            </span>
                                        </div>

                                        {/* Priority Tag */}
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 800,
                                                padding: "3px 10px",
                                                borderRadius: "8px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.04em",
                                                background: isHighPriority ? "#fee2e2" : isMedPriority ? "#fef3c7" : "#dcfce7",
                                                color: isHighPriority ? "#991b1b" : isMedPriority ? "#92400e" : "#166534",
                                                border: isHighPriority ? "1px solid #fca5a5" : isMedPriority ? "1px solid #fde68a" : "1px solid #86efac"
                                            }}
                                        >
                                            {theme.priority || "LOW"}
                                        </span>
                                    </div>

                                    {/* Volume Change & Period Breakdown */}
                                    <div
                                        style={{
                                            margin: "12px 0",
                                            padding: "10px 14px",
                                            backgroundColor: "var(--bg-subtle, #f8fafc)",
                                            borderRadius: "10px",
                                            border: "1px solid var(--border-light)"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                                                Volume Change
                                            </span>
                                            <strong
                                                style={{
                                                    fontSize: "0.85rem",
                                                    fontWeight: 700,
                                                    color: trend.isUp ? (isHighPriority ? "#dc2626" : "#16a34a") : trend.isDown ? "#16a34a" : "var(--text-muted)"
                                                }}
                                            >
                                                {trend.label}
                                            </strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                            <span><strong>{theme.thisMonth ?? theme.frequency}</strong> this month</span>
                                            <span><strong>{theme.previousMonth ?? 0}</strong> previous month</span>
                                        </div>
                                    </div>

                                    {/* Total Feedback & Sentiment Breakdown */}
                                    <div style={{ marginBottom: "14px" }}>
                                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                                            {theme.frequency} Total Feedback
                                        </div>
                                        <div className="theme-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.82rem", color: "#16a34a", background: "#f0fdf4", padding: "4px 8px", borderRadius: "6px" }}>
                                                <Smile size={14} />
                                                <span>Pos: <strong>{theme.positive}</strong></span>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.82rem", color: "#475569", background: "#f8fafc", padding: "4px 8px", borderRadius: "6px" }}>
                                                <Meh size={14} />
                                                <span>Neu: <strong>{theme.neutral}</strong></span>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.82rem", color: "#dc2626", background: "#fef2f2", padding: "4px 8px", borderRadius: "6px" }}>
                                                <Frown size={14} />
                                                <span>Neg: <strong>{theme.negative}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Negative Feedback Rate */}
                                    <div style={{ padding: "10px 0", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                            Negative Feedback Rate
                                        </span>
                                        <strong
                                            style={{
                                                fontSize: "1rem",
                                                fontWeight: 800,
                                                color: Number(theme.negativeFeedbackRate) >= 40 ? "#dc2626" : Number(theme.negativeFeedbackRate) >= 15 ? "#d97706" : "#16a34a"
                                            }}
                                        >
                                            {Number(theme.negativeFeedbackRate || 0).toFixed(1)}%
                                        </strong>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
                                    <Link
                                        to={`/feedback?featureArea=${encodeURIComponent(theme.featureArea || "ALL")}`}
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: "7px 10px", fontSize: "0.78rem", textAlign: "center", textDecoration: "none" }}
                                    >
                                        View Feedback
                                    </Link>
                                    <Link
                                        to={`/themes/${encodeURIComponent(themeName)}`}
                                        className="btn-primary"
                                        style={{
                                            flex: 1,
                                            padding: "7px 10px",
                                            fontSize: "0.78rem",
                                            textAlign: "center",
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "4px"
                                        }}
                                    >
                                        <span>View Insights</span>
                                        <ArrowUpRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Themes;
