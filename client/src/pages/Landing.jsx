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
    UserPlus,
    Layers,
    Activity,
    Shield,
    Database,
    Cpu,
    ExternalLink,
    Lock,
    Eye
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
        <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "inherit" }}>
            {/* Top Navigation Bar with Full Visibility */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(16px)",
                backgroundColor: "rgba(11, 15, 25, 0.92)",
                borderBottom: "1px solid #1e293b",
                padding: "0.9rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                {/* Brand Left */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        boxShadow: "0 0 16px rgba(37, 99, 235, 0.35)"
                    }}>
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.5px", color: "#ffffff" }}>LOOP</span>
                            <span style={{ fontSize: "0.7rem", padding: "2px 7px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.15)", color: "#60a5fa", border: "1px solid rgba(37, 99, 235, 0.3)", fontWeight: 600 }}>v2.0 SaaS</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Feedback Intelligence Platform</div>
                    </div>
                </div>

                {/* Center Quick Navigation Links */}
                <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.88rem", fontWeight: 600 }}>
                    <a href="#features" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#ffffff"} onMouseOut={(e) => e.target.style.color = "#94a3b8"}>
                        Features
                    </a>
                    <a href="#demo-accounts" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#ffffff"} onMouseOut={(e) => e.target.style.color = "#94a3b8"}>
                        Demo Accounts
                    </a>
                    <a href="#architecture" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#ffffff"} onMouseOut={(e) => e.target.style.color = "#94a3b8"}>
                        Architecture
                    </a>
                </nav>

                {/* Right Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {user ? (
                        <Link
                            to="/dashboard"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                textDecoration: "none",
                                padding: "8px 18px",
                                borderRadius: "8px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: "0.88rem",
                                boxShadow: "0 0 12px rgba(37, 99, 235, 0.3)"
                            }}
                        >
                            <span>Open Workspace</span>
                            <ArrowRight size={16} />
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: "8px",
                                    color: "#f8fafc",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.88rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "1px solid #334155",
                                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                                    transition: "all 0.2s"
                                }}
                            >
                                <LogIn size={15} />
                                <span>Sign In</span>
                            </Link>

                            <Link
                                to="/register"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.88rem",
                                    padding: "8px 18px",
                                    borderRadius: "8px",
                                    backgroundColor: "#2563eb",
                                    color: "#ffffff",
                                    border: "none",
                                    boxShadow: "0 0 14px rgba(37, 99, 235, 0.3)"
                                }}
                            >
                                <UserPlus size={15} />
                                <span>Create Workspace</span>
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: "4.5rem 1.5rem 3rem",
                textAlign: "center",
                maxWidth: "1020px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.4rem"
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    background: "rgba(37, 99, 235, 0.12)",
                    border: "1px solid rgba(37, 99, 235, 0.28)",
                    color: "#93c5fd",
                    fontSize: "0.84rem",
                    fontWeight: 600
                }}>
                    <ShieldCheck size={15} color="#60a5fa" />
                    <span>Enterprise Customer Feedback Intelligence Platform</span>
                </div>

                <h1 style={{
                    fontSize: "3.2rem",
                    fontWeight: 900,
                    lineHeight: 1.16,
                    letterSpacing: "-0.5px",
                    color: "#ffffff",
                    margin: 0
                }}>
                    Transform Multi-Channel Feedback into Actionable Product Roadmaps
                </h1>

                <p style={{
                    fontSize: "1.12rem",
                    color: "#94a3b8",
                    maxWidth: "760px",
                    lineHeight: 1.65,
                    margin: "0 auto"
                }}>
                    LOOP automatically ingests, classifies, and clusters customer feedback in real time. Powered by AI sentiment analysis, semantic vector embeddings, theme trend tracking, and automated VoC executive reports.
                </p>

                {/* Hero Actions */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "0.8rem",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <Link
                        to="/register"
                        style={{
                            padding: "12px 28px",
                            fontSize: "0.98rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            borderRadius: "10px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            boxShadow: "0 0 24px rgba(37, 99, 235, 0.4)"
                        }}
                    >
                        <span>Start Free Workspace</span>
                        <ArrowRight size={18} />
                    </Link>

                    <Link
                        to="/login"
                        style={{
                            padding: "12px 24px",
                            fontSize: "0.98rem",
                            fontWeight: 600,
                            borderRadius: "10px",
                            color: "#f8fafc",
                            border: "1px solid #334155",
                            backgroundColor: "#1e293b",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <LogIn size={18} />
                        <span>Sign In to Dashboard</span>
                    </Link>
                </div>

                {/* Feature Pills */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    marginTop: "1.2rem",
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Multi-Tenant Workspace Isolation
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Grounded RAG Vector Q&A
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Role-Based Access Control (RBAC)
                    </span>
                </div>
            </section>

            {/* Instant Demo Sandbox Access Card */}
            <section id="demo-accounts" style={{
                maxWidth: "1020px",
                margin: "1rem auto 4rem",
                width: "92%",
                padding: "2rem",
                backgroundColor: "#111827",
                borderRadius: "16px",
                border: "1px solid #1f2937",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        <Zap size={16} color="#38bdf8" />
                        <span>Instant Sandbox Testing</span>
                    </div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
                        1-Click Live Demo Access
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "4px" }}>
                        Explore the Acme Corp pre-seeded workspace populated with 125 feedback records, AI themes, and analytics:
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.2rem"
                }}>
                    {/* Admin Tier */}
                    <div style={{
                        padding: "1.4rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontWeight: 700, fontSize: "1rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Shield size={18} color="#3b82f6" />
                                    <span>Admin Role</span>
                                </span>
                                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", fontWeight: 700 }}>FULL ACCESS</span>
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                                <strong>User:</strong> <code>admin@acme.com</code><br />
                                <strong>Password:</strong> <code>password123</code>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "10px", lineHeight: 1.5 }}>
                                Ingest datasets via CSV, triage feedback, re-run AI jobs, manage members, download PDF VoC reports.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("admin@acme.com")}
                            style={{
                                width: "100%",
                                padding: "9px",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                transition: "background 0.2s"
                            }}
                        >
                            <LogIn size={15} />
                            <span>Sign In as Admin</span>
                        </button>
                    </div>

                    {/* Analyst Tier */}
                    <div style={{
                        padding: "1.4rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontWeight: 700, fontSize: "1rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Sparkles size={18} color="#a855f7" />
                                    <span>Analyst Role</span>
                                </span>
                                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", fontWeight: 700 }}>ANALYTICS & Q&A</span>
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                                <strong>User:</strong> <code>analyst@acme.com</code><br />
                                <strong>Password:</strong> <code>password123</code>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "10px", lineHeight: 1.5 }}>
                                Explore Theme Explorer, detect negativity rate spikes, query Ask LOOP with cosine similarity RAG.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("analyst@acme.com")}
                            style={{
                                width: "100%",
                                padding: "9px",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "rgba(168, 85, 247, 0.15)",
                                color: "#c084fc",
                                border: "1px solid rgba(168, 85, 247, 0.35)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                            }}
                        >
                            <LogIn size={15} />
                            <span>Sign In as Analyst</span>
                        </button>
                    </div>

                    {/* Viewer Tier */}
                    <div style={{
                        padding: "1.4rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontWeight: 700, fontSize: "1rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Eye size={18} color="#94a3b8" />
                                    <span>Viewer Role</span>
                                </span>
                                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", fontWeight: 700 }}>READ ONLY</span>
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                                <strong>User:</strong> <code>viewer@acme.com</code><br />
                                <strong>Password:</strong> <code>password123</code>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "10px", lineHeight: 1.5 }}>
                                Read-only visibility into charts, volume distribution, sentiment donuts, and historical feedback trends.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("viewer@acme.com")}
                            style={{
                                width: "100%",
                                padding: "9px",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                color: "#f8fafc",
                                border: "1px solid #334155",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                            }}
                        >
                            <LogIn size={15} />
                            <span>Sign In as Viewer</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section id="features" style={{
                maxWidth: "1080px",
                margin: "0 auto 4.5rem",
                width: "92%"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#60a5fa", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        <Activity size={16} />
                        <span>Core Capabilities</span>
                    </div>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
                        Complete 4-Stage Feedback Intelligence Engine
                    </h2>
                    <p style={{ color: "#94a3b8", marginTop: "6px" }}>From raw customer tickets to structured executive decisions.</p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1.4rem"
                }}>
                    <div style={{
                        padding: "1.6rem",
                        borderRadius: "12px",
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                    }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(37, 99, 235, 0.15)",
                            color: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <UploadCloud size={22} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem", color: "#ffffff" }}>Universal Ingestion</h4>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Stream feedback from Zendesk, App Store, Intercom, or any CSV dataset. Dynamically normalizes headers and extracts content.
                        </p>
                    </div>

                    <div style={{
                        padding: "1.6rem",
                        borderRadius: "12px",
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                    }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(168, 85, 247, 0.15)",
                            color: "#a855f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Sparkles size={22} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem", color: "#ffffff" }}>AI Classification</h4>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Classifies sentiment score (-1.0 to +1.0), assigns multi-theme join mappings with confidence scores, and generates rationales.
                        </p>
                    </div>

                    <div style={{
                        padding: "1.6rem",
                        borderRadius: "12px",
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                    }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            color: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Search size={22} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem", color: "#ffffff" }}>Ask LOOP RAG</h4>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Natural language Q&A over customer sentiment. Uses vector cosine similarity to ground answers with cited feedback IDs.
                        </p>
                    </div>

                    <div style={{
                        padding: "1.6rem",
                        borderRadius: "12px",
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                    }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(245, 158, 11, 0.15)",
                            color: "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <FileText size={22} />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem", color: "#ffffff" }}>VoC PDF Digest</h4>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Automated Voice-of-Customer reports for leadership. Summarizes period volume, sentiment shifts, and key recommendations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Architecture Section */}
            <section id="architecture" style={{
                maxWidth: "1080px",
                margin: "0 auto 4.5rem",
                width: "92%",
                padding: "2.5rem",
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                border: "1px solid #1e293b"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                    <Cpu size={22} color="#38bdf8" />
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>System Architecture & Engineering Specs</h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
                    <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                            Frontend Architecture
                        </h4>
                        <ul style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.7, paddingLeft: "1.2rem", margin: 0 }}>
                            <li>React 18 + Vite with dynamic code-splitting</li>
                            <li>Vanilla CSS Design System (no Tailwind bloat)</li>
                            <li>Lucide React Vector Iconography</li>
                            <li>Recharts for responsive Area, Bar, and Donut charts</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                            Backend & Intelligence
                        </h4>
                        <ul style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.7, paddingLeft: "1.2rem", margin: 0 }}>
                            <li>Node.js / Express 5 API Server</li>
                            <li>MongoDB Atlas with multi-tenant isolation</li>
                            <li>FeedbackTheme join entities with confidence scoring</li>
                            <li>Vector embeddings for RAG retrieval & PDF generation</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer with Required Legal Text */}
            <footer style={{
                marginTop: "auto",
                borderTop: "1px solid #1e293b",
                padding: "2.5rem 2rem",
                textAlign: "center",
                fontSize: "0.88rem",
                color: "#94a3b8",
                backgroundColor: "#080c14"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <Link to="/login" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
                    <span style={{ color: "#475569" }}>•</span>
                    <Link to="/register" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}>Create Workspace</Link>
                    <span style={{ color: "#475569" }}>•</span>
                    <a href="https://github.com/madhan023-mn/ai-customer-feedback" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span>GitHub Repository</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.92rem", marginBottom: "6px" }}>
                    All Rights Reserved — Zidio Development Engineering Team
                </div>

                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    Project LOOP • AI Customer Feedback Intelligence Platform (MERN Stack)
                </div>
            </footer>
        </div>
    );
}

export default Landing;
