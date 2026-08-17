import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
    MessageSquare,
    Sparkles,
    BarChart3,
    Search,
    FileText,
    ShieldCheck,
    UploadCloud,
    ArrowRight,
    CheckCircle2,
    Users,
    TrendingUp,
    Zap,
    LogIn,
    UserPlus
} from "lucide-react";

function Landing() {
    const navigate = useNavigate();
    const { user, login } = useAuth();

    async function handleDemoLogin(email) {
        try {
            await login(email, "password123");
            navigate("/dashboard");
        } catch (err) {
            navigate("/login");
        }
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)", display: "flex", flexDirection: "column" }}>
            {/* Top Navigation Bar */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(10, 15, 29, 0.85)",
                borderBottom: "1px solid var(--border-color)",
                padding: "1rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        boxShadow: "0 0 16px rgba(59, 130, 246, 0.4)"
                    }}>
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.5px" }}>PROJECT LOOP</span>
                        <span style={{ fontSize: "0.75rem", marginLeft: "8px", padding: "2px 8px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", fontWeight: 600 }}>v2.0 SaaS</span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {user ? (
                        <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                            <span>Go to Dashboard</span>
                            <ArrowRight size={16} />
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: "8px",
                                    color: "var(--text-main)",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "1px solid var(--border-color)",
                                    transition: "all 0.2s"
                                }}
                            >
                                <LogIn size={16} />
                                <span>Sign In</span>
                            </Link>

                            <Link
                                to="/register"
                                className="btn-primary"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    padding: "8px 18px"
                                }}
                            >
                                <UserPlus size={16} />
                                <span>Create Workspace</span>
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: "5rem 2rem 3rem",
                textAlign: "center",
                maxWidth: "1000px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem"
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    background: "rgba(99, 102, 241, 0.12)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    color: "#a5b4fc",
                    fontSize: "0.85rem",
                    fontWeight: 600
                }}>
                    <Sparkles size={14} color="#818cf8" />
                    <span>AI-Powered Customer Feedback Intelligence Platform</span>
                </div>

                <h1 style={{
                    fontSize: "3.2rem",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: "-0.5px",
                    background: "linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    Transform Customer Noise into Clear Product Roadmaps
                </h1>

                <p style={{
                    fontSize: "1.15rem",
                    color: "var(--text-muted)",
                    maxWidth: "720px",
                    lineHeight: 1.6
                }}>
                    LOOP automatically ingests, classifies, and clusters multi-channel customer feedback in real time with AI sentiment analysis, semantic vector search, and executive VoC digests.
                </p>

                {/* Primary CTA Buttons */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <Link
                        to="/register"
                        className="btn-primary"
                        style={{
                            padding: "12px 28px",
                            fontSize: "1rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            borderRadius: "10px",
                            boxShadow: "0 0 24px rgba(59, 130, 246, 0.35)"
                        }}
                    >
                        <span>Start Free Workspace</span>
                        <ArrowRight size={18} />
                    </Link>

                    <Link
                        to="/login"
                        style={{
                            padding: "12px 24px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "10px",
                            color: "var(--text-main)",
                            border: "1px solid var(--border-color)",
                            backgroundColor: "var(--bg-card)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <LogIn size={18} />
                        <span>Sign In</span>
                    </Link>
                </div>

                {/* Trust Badges */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    marginTop: "1.5rem",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Multi-Tenant Workspace Isolation
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> RAG Grounded Vector Q&A
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Role-Based Access Control
                    </span>
                </div>
            </section>

            {/* Instant Demo Sandbox Access Card */}
            <section style={{
                maxWidth: "960px",
                margin: "1rem auto 4rem",
                width: "90%",
                padding: "2rem",
                backgroundColor: "var(--bg-card)",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.3)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <Zap size={20} color="#f59e0b" />
                        <span>Instant 1-Click Demo Sandbox</span>
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Explore the pre-seeded workspace with 125 real customer feedback entries, AI themes, and charts:
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1rem"
                }}>
                    {/* Admin Card */}
                    <div style={{
                        padding: "1.25rem",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-main)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "12px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Admin Account</span>
                                <span className="badge badge-primary">Full Control</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                <code>admin@acme.com</code> / <code>password123</code>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
                                Ingest CSV, manage team roles, trigger AI pipeline, download VoC PDF reports.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("admin@acme.com")}
                            className="btn-primary"
                            style={{ width: "100%", padding: "8px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                        >
                            <LogIn size={14} />
                            <span>Sign In as Admin</span>
                        </button>
                    </div>

                    {/* Analyst Card */}
                    <div style={{
                        padding: "1.25rem",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-main)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "12px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Analyst Account</span>
                                <span className="badge badge-info">Insights & Q&A</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                <code>analyst@acme.com</code> / <code>password123</code>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
                                Explore theme clusters, detect negative spikes 🔥, and query grounded vector Ask LOOP.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("analyst@acme.com")}
                            style={{
                                width: "100%",
                                padding: "8px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "rgba(59, 130, 246, 0.15)",
                                color: "#60a5fa",
                                border: "1px solid rgba(59, 130, 246, 0.3)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                            }}
                        >
                            <LogIn size={14} />
                            <span>Sign In as Analyst</span>
                        </button>
                    </div>

                    {/* Viewer Card */}
                    <div style={{
                        padding: "1.25rem",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-main)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "12px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Viewer Account</span>
                                <span className="badge badge-neutral">Read Only</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                <code>viewer@acme.com</code> / <code>password123</code>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
                                Read-only access to feedback trends, sentiment donuts, and channel volume distribution.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("viewer@acme.com")}
                            style={{
                                width: "100%",
                                padding: "8px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                color: "var(--text-main)",
                                border: "1px solid var(--border-color)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                            }}
                        >
                            <LogIn size={14} />
                            <span>Sign In as Viewer</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section style={{
                maxWidth: "1100px",
                margin: "0 auto 4rem",
                width: "90%"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Complete 4-Stage Feedback Intelligence Architecture</h2>
                    <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>Everything required to close the loop from raw customer tickets to executive action items.</p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem"
                }}>
                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
                            <UploadCloud size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem" }}>Universal CSV Ingestion</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
                            Upload datasets from Zendesk, App Store, Intercom, or Typeform. Dynamically matches feedback content and normalizes headers.
                        </p>
                    </div>

                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
                            <Sparkles size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem" }}>AI Classification</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
                            Extracts sentiment (-1.0 to +1.0), maps multi-label theme relationships with confidence scoring, and drafts product rationales.
                        </p>
                    </div>

                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                            <Search size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem" }}>Ask LOOP RAG Search</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
                            Query your customer feedback base in natural language. Uses cosine vector similarity to cite exact customer feedback IDs.
                        </p>
                    </div>

                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                            <FileText size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem" }}>VoC PDF Reports</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
                            Generate executive-ready Voice-of-Customer digest PDFs with theme trends, volume deltas, and actionable recommendations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                marginTop: "auto",
                borderTop: "1px solid var(--border-color)",
                padding: "2rem",
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                backgroundColor: "rgba(10, 15, 29, 0.95)"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <Link to="/login" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Sign In</Link>
                    <span>•</span>
                    <Link to="/register" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Create Workspace</Link>
                    <span>•</span>
                    <a href="https://github.com/madhan023-mn/ai-customer-feedback" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>GitHub Repository</a>
                </div>
                <div>© 2026 Project LOOP • Customer Feedback Intelligence Platform (MERN Stack)</div>
            </footer>
        </div>
    );
}

export default Landing;
