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
    ShieldCheck,
    ListChecks
} from "lucide-react";

// Formats answer text into structured point-by-point sections without markdown symbols
function FormattedAnswer({ answerText }) {
    if (!answerText) return null;

    // Remove any raw markdown hashes, stars, or brackets
    const cleaned = answerText
        .replace(/^###\s+/gm, "")
        .replace(/^##\s+/gm, "")
        .replace(/^#\s+/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1");

    // Split into paragraphs / sections
    const rawSections = cleaned.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {rawSections.map((sec, secIdx) => {
                const lines = sec.split("\n").map(l => l.trim()).filter(Boolean);
                if (lines.length === 0) return null;

                const firstLine = lines[0];
                const isHeading = firstLine.endsWith(":") ||
                    /^(key customer findings|key findings|key themes|representative verbatim|verbatim quotes|recommended product actions|recommended actions|summary|grounded analysis)/i.test(firstLine);

                if (isHeading) {
                    const headingTitle = firstLine.replace(/:$/, "");
                    const listItems = lines.slice(1);

                    return (
                        <div
                            key={secIdx}
                            style={{
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-light)",
                                borderRadius: "12px",
                                padding: "16px 20px"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                color: "var(--primary)",
                                marginBottom: listItems.length > 0 ? "12px" : "0"
                            }}>
                                <ListChecks size={18} />
                                <span>{headingTitle}</span>
                            </div>

                            {listItems.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {listItems.map((item, itemIdx) => {
                                        const cleanItem = item.replace(/^[•\-\d\.]+\s*/, "");
                                        return (
                                            <div
                                                key={itemIdx}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "10px",
                                                    fontSize: "0.92rem",
                                                    lineHeight: "1.6",
                                                    color: "var(--text-main)"
                                                }}
                                            >
                                                <span style={{
                                                    display: "inline-block",
                                                    width: "6px",
                                                    height: "6px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "var(--primary)",
                                                    marginTop: "8px",
                                                    flexShrink: 0
                                                }} />
                                                <span>{cleanItem}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                // Standard summary paragraph
                return (
                    <div
                        key={secIdx}
                        style={{
                            fontSize: "0.96rem",
                            lineHeight: "1.7",
                            color: "var(--text-main)",
                            backgroundColor: "rgba(59, 130, 246, 0.04)",
                            border: "1px solid rgba(59, 130, 246, 0.15)",
                            borderRadius: "12px",
                            padding: "16px 20px"
                        }}
                    >
                        {lines.map((l, lIdx) => (
                            <p key={lIdx} style={{ margin: lIdx === 0 ? 0 : "8px 0 0 0" }}>
                                {l}
                            </p>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

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
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom: "1.75rem" }}>
                <div>
                    <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Sparkles size={26} color="var(--primary)" />
                        <span>Ask LOOP — Q&A</span>
                    </h1>
                    <p className="page-subtitle">
                        Ask questions about customer feedback and get instant AI-powered answers.
                    </p>
                </div>
            </div>

            {/* Q&A Input & Suggestions Section */}
            <div className="auth-card" style={{ maxWidth: "860px", margin: "0 auto 2rem auto" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
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
                                style={{ fontSize: "0.95rem", padding: "12px 16px", flex: 1 }}
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !question.trim()}
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 24px", minWidth: "110px", justifyContent: "center" }}
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
                <div style={{ marginTop: "1rem" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
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
                                    fontSize: "0.83rem",
                                    fontWeight: 600,
                                    border: "1px solid var(--border-light)",
                                    backgroundColor: "var(--bg-subtle)",
                                    color: "var(--text-main)",
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
                <div className="alert-error" style={{ maxWidth: "860px", margin: "0 auto 1.5rem auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Answer Display & Cited Sources */}
            {result && (
                <div style={{ maxWidth: "860px", margin: "0 auto" }}>
                    {/* Grounded Answer Card */}
                    <div style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "16px",
                        padding: "24px",
                        marginBottom: "24px",
                        boxShadow: "var(--shadow-md)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: 700, fontSize: "1.05rem" }}>
                                <Sparkles size={20} />
                                <span>Grounded Answer</span>
                            </div>

                            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(34, 197, 94, 0.1)", color: "#16a34a", padding: "4px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700 }}>
                                <ShieldCheck size={14} />
                                <span>Grounded in Real Data</span>
                            </div>
                        </div>

                        {/* Point-by-point formatted answer */}
                        <FormattedAnswer answerText={result.answer} />

                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.83rem", color: "var(--text-muted)", paddingTop: "14px", marginTop: "18px", borderTop: "1px solid var(--border-light)" }}>
                            <CheckCircle2 size={15} color="var(--primary)" />
                            <span>Cited from {result.citedFeedback ? result.citedFeedback.length : 0} workspace customer feedback records.</span>
                        </div>
                    </div>

                    {/* Cited Feedback Sources Grid */}
                    {result.citedFeedback && result.citedFeedback.length > 0 && (
                        <div className="table-card" style={{ padding: "24px", marginBottom: "2rem" }}>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-main)" }}>
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

                                        <blockquote className="quote-text" style={{ fontSize: "0.88rem", margin: "10px 0", color: "var(--text-main)" }}>
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

