import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import {
    ArrowLeft,
    Smile,
    Meh,
    Frown,
    Cpu,
    CheckCircle2,
    Clock,
    AlertCircle,
    ShieldAlert,
    Loader2,
    RotateCcw,
    User,
    Tag,
    Layers,
    Calendar,
    Sparkles
} from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";

function FeedbackDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const canEdit = user?.role === "ADMIN" || user?.role === "ANALYST";

    async function loadFeedback() {
        try {
            setLoading(true);
            setError("");
            const response = await api.get(`/feedback/${id}`);
            setFeedback(response.data.feedback || response.data);
        } catch (err) {
            console.error("Load feedback details error:", err);
            setError(err.response?.data?.message || "Failed to load feedback record");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFeedback();
    }, [id]);

    async function changeStatus(newStatus) {
        if (!canEdit) return;
        try {
            setUpdatingStatus(true);
            const response = await api.patch(`/feedback/${id}/status`, { status: newStatus });
            setFeedback(response.data.feedback || { ...feedback, status: newStatus });
        } catch (err) {
            try {
                const res = await api.patch(`/feedback/${id}`, { status: newStatus });
                setFeedback(res.data.feedback || { ...feedback, status: newStatus });
            } catch (patchErr) {
                alert(err.response?.data?.message || patchErr.response?.data?.message || "Failed to update status");
            }
        } finally {
            setUpdatingStatus(false);
        }
    }

    async function analyzeWithAI() {
        if (!canEdit || analyzing) return;
        try {
            setAnalyzing(true);
            let response;
            try {
                response = await api.post(`/feedback/${id}/analyze`);
            } catch (err1) {
                response = await api.post(`/ai/feedback/${id}/analyze`);
            }
            if (response?.data?.feedback) {
                setFeedback(response.data.feedback);
            } else {
                await loadFeedback();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to analyze feedback item with AI");
        } finally {
            setAnalyzing(false);
        }
    }

    if (loading) {
        return (
            <div className="feedback-details-page" style={{ padding: "2rem" }}>
                <LoadingScreen
                    title="Loading Feedback Record..."
                    subtitle="Retrieving customer submission, AI classifications, and thematic insights"
                    minHeight="55vh"
                />
            </div>
        );
    }

    if (error || !feedback) {
        return (
            <div className="feedback-details-page" style={{ padding: "2rem" }}>
                <Link to="/feedback" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px", textDecoration: "none", color: "var(--text-muted)" }}>
                    <ArrowLeft size={16} />
                    <span>Back to Feedback</span>
                </Link>
                <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px", background: "#fef2f2", color: "#dc2626", borderRadius: "10px", border: "1px solid #fca5a5" }}>
                    <AlertCircle size={18} />
                    <span>{error || "Feedback not found"}</span>
                </div>
            </div>
        );
    }

    const priority = feedback.priority || (feedback.sentiment === "NEG" ? "HIGH" : "LOW");

    return (
        <div className="feedback-details-page" style={{ maxWidth: "100%", padding: "1.5rem 0" }}>
            <Link to="/feedback" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px", textDecoration: "none", color: "var(--text-muted)", fontWeight: 500 }}>
                <ArrowLeft size={16} />
                <span>Back to Feedback Hub</span>
            </Link>

            <div className="feedback-detail-card" style={{ background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
                                Feedback Record Details
                            </h1>
                            <span
                                style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 800,
                                    padding: "3px 10px",
                                    borderRadius: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    background: priority === "HIGH" ? "#fee2e2" : priority === "MEDIUM" ? "#fef3c7" : "#dcfce7",
                                    color: priority === "HIGH" ? "#991b1b" : priority === "MEDIUM" ? "#92400e" : "#166534",
                                    border: priority === "HIGH" ? "1px solid #fca5a5" : priority === "MEDIUM" ? "1px solid #fde68a" : "1px solid #86efac",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                }}
                            >
                                {priority === "HIGH" ? <ShieldAlert size={12} /> : priority === "MEDIUM" ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                <span>{priority} Priority</span>
                            </span>
                        </div>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                            ID: <code>{feedback._id}</code>
                        </span>
                    </div>

                    {canEdit && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
                                Workflow Status:
                            </label>
                            <select
                                className="filter-select"
                                value={feedback.status || "NEW"}
                                disabled={updatingStatus}
                                onChange={(e) => changeStatus(e.target.value)}
                                style={{ padding: "6px 12px", fontSize: "0.88rem", borderRadius: "8px" }}
                            >
                                <option value="NEW">NEW</option>
                                <option value="REVIEWED">REVIEWED</option>
                                <option value="ACTIONED">ACTIONED</option>
                                <option value="RESOLVED">RESOLVED</option>
                                <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Primary Feedback Text */}
                <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", border: "1px solid var(--border-light)", marginBottom: "25px" }}>
                    <h2 style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, margin: "0 0 8px 0" }}>
                        Customer Feedback Content
                    </h2>
                    <p style={{ fontSize: "1.15rem", lineHeight: 1.6, color: "var(--text-main)", margin: 0, fontWeight: 500 }}>
                        "{feedback.content}"
                    </p>
                </div>

                {/* Metadata Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "25px" }}>
                    <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                            <User size={13} />
                            <span>Customer</span>
                        </span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{feedback.customerLabel || "Customer"}</strong>
                    </div>

                    <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                            <Tag size={13} />
                            <span>Channel</span>
                        </span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{feedback.channel}</strong>
                    </div>

                    <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                            <Layers size={13} />
                            <span>Feature Area</span>
                        </span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{feedback.featureArea || "General"}</strong>
                    </div>

                    <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                            Sentiment
                        </span>
                        <strong style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.95rem" }}>
                            {feedback.sentiment === "POS" ? <Smile size={16} color="#16a34a" /> :
                             feedback.sentiment === "NEG" ? <Frown size={16} color="#dc2626" /> : <Meh size={16} color="#64748b" />}
                            <span style={{ color: feedback.sentiment === "POS" ? "#16a34a" : feedback.sentiment === "NEG" ? "#dc2626" : "#475569" }}>
                                {feedback.sentiment === "POS" ? "Positive" : feedback.sentiment === "NEG" ? "Negative" : "Neutral"}
                            </span>
                        </strong>
                    </div>

                    <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                            Sentiment Score
                        </span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{feedback.sentimentScore ?? 0}</strong>
                    </div>

                    <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                            AI Status
                        </span>
                        <strong style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.95rem",
                            color: feedback.aiStatus === "COMPLETED" ? "#16a34a" :
                                   feedback.aiStatus === "FAILED" ? "#dc2626" : "#d97706"
                        }}>
                            {feedback.aiStatus === "COMPLETED" && <CheckCircle2 size={14} color="#16a34a" />}
                            {feedback.aiStatus === "PENDING" && <Clock size={14} color="#d97706" />}
                            {feedback.aiStatus === "FAILED" && <AlertCircle size={14} color="#dc2626" />}
                            <span>{feedback.aiStatus || "PENDING"}</span>
                        </strong>
                    </div>
                </div>

                {/* AI Intelligence & Rationale Block */}
                <div style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                        <h2 style={{ fontSize: "1rem", color: "var(--primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                            <Sparkles size={18} />
                            <span>AI Classification, Theme & Issue Analysis</span>
                        </h2>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {canEdit && (
                                <button
                                    className="btn-primary"
                                    onClick={analyzeWithAI}
                                    disabled={analyzing}
                                    style={{
                                        padding: "5px 14px",
                                        fontSize: "0.82rem",
                                        fontWeight: 600,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        borderRadius: "8px"
                                    }}
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                                            <span>Analyzing with AI...</span>
                                        </>
                                    ) : feedback.aiStatus === "COMPLETED" ? (
                                        <>
                                            <RotateCcw size={13} />
                                            <span>Re-analyze with AI</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={13} />
                                            <span>Analyze with AI</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px", fontSize: "0.9rem" }}>
                        <div>
                            <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.82rem", display: "block" }}>Themes:</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                                {Array.isArray(feedback.themes) && feedback.themes.length > 0 ? (
                                    feedback.themes.map((t, i) => (
                                        <span key={i} className="badge" style={{ backgroundColor: "rgba(109, 93, 252, 0.1)", color: "#6d5dfc", fontSize: "0.78rem" }}>
                                            {typeof t === "object" ? t.name : t}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: "var(--text-muted)" }}>None</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.82rem", display: "block" }}>Identified Issue:</span>
                            <strong style={{ color: feedback.issue && feedback.issue !== "NONE" ? "#dc2626" : "#16a34a", fontSize: "0.92rem", marginTop: "4px", display: "block" }}>
                                {feedback.issue || "NONE"}
                            </strong>
                        </div>

                        <div>
                            <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.82rem", display: "block" }}>Severity:</span>
                            <strong style={{ color: feedback.severity === "HIGH" ? "#dc2626" : feedback.severity === "MEDIUM" ? "#d97706" : "#16a34a", fontSize: "0.92rem", marginTop: "4px", display: "block" }}>
                                {feedback.severity || "LOW"}
                            </strong>
                        </div>
                    </div>

                    <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(99, 102, 241, 0.15)" }}>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "4px", fontSize: "0.82rem" }}>
                            AI Reasoning & Rationale:
                        </span>
                        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-main)", margin: 0 }}>
                            {feedback.rationale || "No AI rationale available for this feedback."}
                        </p>
                    </div>

                    {feedback.aiError && (
                        <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#dc2626", background: "#fee2e2", padding: "10px 14px", borderRadius: "8px", border: "1px solid #fca5a5" }}>
                            <strong>Analysis Error:</strong> {feedback.aiError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FeedbackDetails;
