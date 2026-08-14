import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
    Sparkles,
    Send,
    Loader2,
    AlertCircle,
    Quote,
    MessageSquare,
    Smile,
    Meh,
    Frown,
    ArrowUpRight,
    HelpCircle,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";

function AskLoop() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const promptSuggestions = [
        "What are users saying about onboarding?",
        "What are top checkout and billing complaints?",
        "What features do users love about the dashboard?",
        "Why are users frustrated with mobile notifications?"
    ];

    async function handleAsk(queryToSubmit) {
        const query = queryToSubmit || question;
        if (!query || !query.trim()) return;

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const res = await api.post("/ai/ask", { question: query });
            setResult(res.data);
        } catch (err) {
            console.error("Ask LOOP error:", err);
            setError(err.response?.data?.message || "Failed to answer question. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleAsk();
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Sparkles size={28} color="var(--primary)" />
                        <span>Ask LOOP — Grounded Q&A</span>
                    </h1>
                    <p className="page-subtitle">
                        Ask plain-English questions and get answers grounded strictly in customer feedback data.
                    </p>
                </div>
            </div>

            {/* Q&A Input & Suggestions Section */}
            <div className="auth-card" style={{ maxWidth: "840px", margin: "0 auto 2rem auto" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                            <HelpCircle size={18} color="var(--primary)" />
                            <span>Ask a question about customer feedback</span>
                        </label>
                        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. What are users saying about onboarding?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                disabled={loading}
                                style={{ fontSize: "1rem", padding: "12px 16px" }}
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !question.trim()}
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 24px" }}
                            >
                                {loading ? (
                                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                                ) : (
                                    <Send size={18} />
                                )}
                                <span>{loading ? "Searching..." : "Ask"}</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Prompt Suggestion Pills */}
                <div style={{ marginTop: "1.25rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Suggested questions:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {promptSuggestions.map((prompt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="badge badge-channel"
                                style={{
                                    cursor: "pointer",
                                    padding: "6px 12px",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    border: "1px solid var(--border-light)",
                                    transition: "all 0.2s"
                                }}
                                onClick={() => {
                                    setQuestion(prompt);
                                    handleAsk(prompt);
                                }}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert-error" style={{ maxWidth: "840px", margin: "0 auto 1.5rem auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Answer Display & Cited Sources */}
            {result && (
                <div style={{ maxWidth: "840px", margin: "0 auto" }}>
                    {/* Grounded Answer Card */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
                        border: "1px solid rgba(99, 102, 241, 0.25)",
                        borderRadius: "16px",
                        padding: "24px",
                        marginBottom: "24px",
                        boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem" }}>
                                <Sparkles size={20} />
                                <span>Grounded Answer</span>
                            </div>

                            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(34, 197, 94, 0.1)", color: "#16a34a", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}>
                                <ShieldCheck size={14} />
                                <span>Grounded in Real Data</span>
                            </div>
                        </div>

                        <div style={{
                            fontSize: "1rem",
                            lineHeight: 1.7,
                            color: "var(--text-main)",
                            whiteSpace: "pre-wrap",
                            marginBottom: "16px"
                        }}>
                            {result.answer}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-muted)", paddingTop: "12px", borderTop: "1px solid rgba(99, 102, 241, 0.15)" }}>
                            <CheckCircle2 size={15} color="var(--primary)" />
                            <span>Cited from {result.citedFeedback ? result.citedFeedback.length : 0} workspace customer feedback records.</span>
                        </div>
                    </div>

                    {/* Cited Feedback Sources Grid */}
                    {result.citedFeedback && result.citedFeedback.length > 0 && (
                        <div className="table-card" style={{ padding: "24px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Quote size={18} color="var(--primary)" />
                                <span>Cited Feedback Sources ({result.citedFeedback.length})</span>
                            </h3>

                            <div className="quotes-grid">
                                {result.citedFeedback.map((item) => (
                                    <div
                                        key={item._id}
                                        className={`quote-card sentiment-border-${item.sentiment ? item.sentiment.toLowerCase() : "neu"}`}
                                    >
                                        <div className="quote-header">
                                            <span className="badge badge-channel">{item.channel}</span>
                                            <span className={`badge ${
                                                item.sentiment === "POS" ? "badge-pos" :
                                                item.sentiment === "NEG" ? "badge-neg" : "badge-neu"
                                            }`}>
                                                {item.sentiment === "POS" ? <Smile size={13} /> :
                                                 item.sentiment === "NEG" ? <Frown size={13} /> : <Meh size={13} />}
                                                <span>{item.sentiment}</span>
                                            </span>
                                        </div>

                                        <blockquote className="quote-text" style={{ fontSize: "0.9rem", margin: "10px 0" }}>
                                            "{item.content}"
                                        </blockquote>

                                        <div className="quote-footer" style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                {item.customerLabel || "Customer"} • {item.featureArea || "General"}
                                            </span>

                                            <Link to={`/feedback/${item._id}`} className="quote-link-btn" title="View Details">
                                                <ArrowUpRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AskLoop;
