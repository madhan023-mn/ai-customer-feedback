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
    Loader2,
    RotateCcw,
    User,
    Tag,
    Layers
} from "lucide-react";

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

    async function triggerAnalysis() {
        if (!canEdit) return;
        try {
            setAnalyzing(true);
            const response = await api.post(`/ai/feedback/${id}/analyze`);
            if (response.data.feedback) {
                setFeedback(response.data.feedback);
            } else {
                loadFeedback();
            }
        } catch (err) {
            try {
                const res = await api.post(`/feedback/${id}/analyze`);
                if (res.data.feedback) {
                    setFeedback(res.data.feedback);
                } else {
                    loadFeedback();
                }
            } catch (aiErr) {
                alert(err.response?.data?.message || aiErr.response?.data?.message || "Analysis failed");
            }
        } finally {
            setAnalyzing(false);
        }
    }

    if (loading) {
        return (
            <div className="feedback-details-page">
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} color="var(--primary)" />
                </div>
            </div>
        );
    }

    if (error || !feedback) {
        return (
            <div className="feedback-details-page">
                <Link to="/feedback" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
                    <ArrowLeft size={16} />
                    <span>Back to Feedback</span>
                </Link>
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error || "Feedback not found"}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-details-page">
            <Link to="/feedback" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
                <ArrowLeft size={16} />
                <span>Back to Feedback</span>
            </Link>

            <div className="feedback-detail-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                        Feedback Record Details
                    </h1>

                    {canEdit && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
                                Status:
                            </label>
                            <select
                                className="filter-select"
                                value={feedback.status || "NEW"}
                                disabled={updatingStatus}
                                onChange={(e) => changeStatus(e.target.value)}
                                style={{ padding: "6px 12px", fontSize: "0.9rem" }}
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

                {/* Primary Content Block */}
                <div className="detail-content" style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", border: "1px solid var(--border-light)", marginBottom: "25px" }}>
                    <h2 style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        Customer Feedback Content
                    </h2>
                    <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#0f172a", margin: 0, fontWeight: 500 }}>
                        "{feedback.content}"
                    </p>
                </div>

                {/* Metadata Grid */}
                <div className="detail-grid">
                    <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <User size={13} />
                            <span>Customer</span>
                        </span>
                        <strong>{feedback.customerLabel || "Anonymous / Unspecified"}</strong>
                    </div>

                    <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Tag size={13} />
                            <span>Channel</span>
                        </span>
                        <strong>{feedback.channel}</strong>
                    </div>

                    <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Layers size={13} />
                            <span>Feature / Theme</span>
                        </span>
                        <strong>{feedback.featureArea || "Not classified"}</strong>
                    </div>

                    <div>
                        <span>Sentiment</span>
                        <strong style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            {feedback.sentiment === "POS" ? <Smile size={16} color="#16a34a" /> :
                             feedback.sentiment === "NEG" ? <Frown size={16} color="#dc2626" /> : <Meh size={16} color="#64748b" />}
                            <span>{feedback.sentiment || "NEU"}</span>
                        </strong>
                    </div>

                    <div>
                        <span>Sentiment Score</span>
                        <strong>{feedback.sentimentScore ?? 0}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>{feedback.status}</strong>
                    </div>

                    <div>
                        <span>AI Status</span>
                        <strong style={{
                            color: feedback.aiStatus === "COMPLETED" ? "#16a34a" :
                                   feedback.aiStatus === "FAILED" ? "#dc2626" : "#6366f1"
                        }}>
                            {feedback.aiStatus || "PENDING"}
                        </strong>
                    </div>
                </div>

                {/* AI Rationale Block */}
                <div className="detail-content" style={{ marginTop: "25px", background: "#faf5ff", padding: "20px", borderRadius: "10px", border: "1px solid #e9d5ff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <h2 style={{ fontSize: "1rem", color: "#6b21a8", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                            <Cpu size={16} />
                            <span>AI Analysis & Rationale</span>
                        </h2>

                        {canEdit && feedback.aiStatus !== "COMPLETED" && (
                            <button
                                className="btn-secondary"
                                disabled={analyzing}
                                onClick={triggerAnalysis}
                                style={{ padding: "4px 10px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                                <RotateCcw size={12} />
                                <span>{analyzing ? "Analyzing..." : "Analyze with AI"}</span>
                            </button>
                        )}
                    </div>

                    <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#334155", margin: 0 }}>
                        {feedback.rationale || "No AI rationale analysis available for this feedback."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FeedbackDetails;
