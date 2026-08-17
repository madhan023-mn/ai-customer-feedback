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
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#090d16",
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            {/* Top Navigation Bar with High Contrast & Complete Visibility */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(16px)",
                backgroundColor: "rgba(9, 13, 22, 0.95)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "1rem 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                {/* Brand Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)"
                    }}>
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.5px", color: "#ffffff" }}>
                                PROJECT LOOP
                            </span>
                            <span style={{
                                fontSize: "0.7rem",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                background: "rgba(37, 99, 235, 0.2)",
                                color: "#60a5fa",
                                border: "1px solid rgba(37, 99, 235, 0.4)",
                                fontWeight: 700
                            }}>
                                v2.0 SaaS
                            </span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            Feedback Intelligence Platform
                        </div>
                    </div>
                </div>

                {/* Center Navigation Links */}
                <nav style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    fontSize: "0.9rem",
                    fontWeight: 600
                }}>
                    <a
                        href="#features"
                        style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = "#ffffff"}
                        onMouseOut={(e) => e.target.style.color = "#cbd5e1"}
                    >
                        Features
                    </a>
                    <a
                        href="#demo-accounts"
                        style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = "#ffffff"}
                        onMouseOut={(e) => e.target.style.color = "#cbd5e1"}
                    >
                        Demo Accounts
                    </a>
                    <a
                        href="#architecture"
                        style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = "#ffffff"}
                        onMouseOut={(e) => e.target.style.color = "#cbd5e1"}
                    >
                        Architecture
                    </a>
                </nav>

                {/* Right Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {user ? (
                        <Link
                            to="/dashboard"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                textDecoration: "none",
                                padding: "9px 20px",
                                borderRadius: "8px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                boxShadow: "0 0 16px rgba(37, 99, 235, 0.35)"
                            }}
                        >
                            <span>Open Dashboard</span>
                            <ArrowRight size={16} />
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    padding: "9px 20px",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"}
                            >
                                <LogIn size={16} />
                                <span>Sign In</span>
                            </Link>

                            <Link
                                to="/register"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    padding: "9px 20px",
                                    borderRadius: "8px",
                                    backgroundColor: "#2563eb",
                                    color: "#ffffff",
                                    border: "none",
                                    boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
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
                padding: "5.5rem 1.5rem 3.5rem",
                textAlign: "center",
                maxWidth: "1060px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem"
            }}>
                {/* Enterprise Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 18px",
                    borderRadius: "24px",
                    background: "rgba(37, 99, 235, 0.12)",
                    border: "1px solid rgba(37, 99, 235, 0.3)",
                    color: "#93c5fd",
                    fontSize: "0.85rem",
                    fontWeight: 600
                }}>
                    <ShieldCheck size={16} color="#60a5fa" />
                    <span>Enterprise Customer Feedback Intelligence Platform</span>
                </div>

                {/* Main Headline */}
                <h1 style={{
                    fontSize: "3.4rem",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: "-0.8px",
                    color: "#ffffff",
                    margin: 0
                }}>
                    Transform Customer Noise into Clear Product Roadmaps
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: "1.18rem",
                    color: "#94a3b8",
                    maxWidth: "780px",
                    lineHeight: 1.7,
                    margin: "0 auto"
                }}>
                    LOOP automatically ingests, classifies, and clusters customer feedback in real time with AI sentiment analysis, semantic vector search, and executive VoC digests.
                </p>

                {/* Primary Action Buttons */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    marginTop: "0.8rem",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <Link
                        to="/register"
                        style={{
                            padding: "13px 30px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            borderRadius: "10px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            boxShadow: "0 0 24px rgba(37, 99, 235, 0.4)",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                    >
                        <span>Start Free Workspace</span>
                        <ArrowRight size={18} />
                    </Link>

                    <Link
                        to="/login"
                        style={{
                            padding: "13px 26px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "10px",
                            color: "#ffffff",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            backgroundColor: "rgba(30, 41, 59, 0.7)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(51, 65, 85, 0.9)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.7)"}
                    >
                        <LogIn size={18} />
                        <span>Sign In</span>
                    </Link>
                </div>

                {/* Trust Badges */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "28px",
                    marginTop: "1.5rem",
                    fontSize: "0.88rem",
                    color: "#94a3b8",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} color="#10b981" /> Multi-Tenant Workspace Isolation
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} color="#10b981" /> RAG Grounded Vector Q&A
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} color="#10b981" /> Role-Based Access Control
                    </span>
                </div>
            </section>

            {/* Instant Demo Sandbox Access Card */}
            <section id="demo-accounts" style={{
                maxWidth: "1060px",
                margin: "1rem auto 4.5rem",
                width: "92%",
                padding: "2.5rem",
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 20px 48px rgba(0, 0, 0, 0.5)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        <Zap size={16} color="#38bdf8" />
                        <span>Instant Sandbox Testing</span>
                    </div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
                        1-Click Live Demo Access
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "4px" }}>
                        Explore the pre-seeded Acme Corp workspace with 125 real customer feedback entries, AI themes, and charts:
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                    gap: "1.4rem"
                }}>
                    {/* Admin Tier */}
                    <div style={{
                        padding: "1.5rem",
                        borderRadius: "12px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Shield size={18} color="#3b82f6" />
                                    <span>Admin Role</span>
                                </span>
                                <span style={{ fontSize: "0.72rem", padding: "3px 9px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", fontWeight: 700 }}>
                                    FULL ACCESS
                                </span>
                            </div>
                            <div style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                                <div><strong>Email:</strong> <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>admin@acme.com</code></div>
                                <div style={{ marginTop: "4px" }}><strong>Password:</strong> <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>password123</code></div>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "12px", lineHeight: 1.55 }}>
                                Ingest CSV datasets, manage team roles, trigger AI processing, download VoC PDF executive reports.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("admin@acme.com")}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                        >
                            <LogIn size={16} />
                            <span>Sign In as Admin</span>
                        </button>
                    </div>

                    {/* Analyst Tier */}
                    <div style={{
                        padding: "1.5rem",
                        borderRadius: "12px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Sparkles size={18} color="#a855f7" />
                                    <span>Analyst Role</span>
                                </span>
                                <span style={{ fontSize: "0.72rem", padding: "3px 9px", borderRadius: "10px", background: "rgba(168, 85, 247, 0.2)", color: "#c084fc", fontWeight: 700 }}>
                                    ANALYTICS & Q&A
                                </span>
                            </div>
                            <div style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                                <div><strong>Email:</strong> <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>analyst@acme.com</code></div>
                                <div style={{ marginTop: "4px" }}><strong>Password:</strong> <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>password123</code></div>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "12px", lineHeight: 1.55 }}>
                                Explore theme clusters, detect negative spikes and volume surges, query grounded vector Ask LOOP.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("analyst@acme.com")}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "rgba(168, 85, 247, 0.18)",
                                color: "#c084fc",
                                border: "1px solid rgba(168, 85, 247, 0.4)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(168, 85, 247, 0.28)"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(168, 85, 247, 0.18)"}
                        >
                            <LogIn size={16} />
                            <span>Sign In as Analyst</span>
                        </button>
                    </div>

                    {/* Viewer Tier */}
                    <div style={{
                        padding: "1.5rem",
                        borderRadius: "12px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Eye size={18} color="#94a3b8" />
                                    <span>Viewer Role</span>
                                </span>
                                <span style={{ fontSize: "0.72rem", padding: "3px 9px", borderRadius: "10px", background: "rgba(148, 163, 184, 0.18)", color: "#cbd5e1", fontWeight: 700 }}>
                                    READ ONLY
                                </span>
                            </div>
                            <div style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                                <div><strong>Email:</strong> <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>viewer@acme.com</code></div>
                                <div style={{ marginTop: "4px" }}><strong>Password:</strong> <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>password123</code></div>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "12px", lineHeight: 1.55 }}>
                                Read-only visibility into charts, volume distribution, sentiment donuts, and historical feedback trends.
                            </p>
                        </div>
                        <button
                            onClick={() => handleDemoLogin("viewer@acme.com")}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.06)",
                                color: "#f8fafc",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"}
                        >
                            <LogIn size={16} />
                            <span>Sign In as Viewer</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section id="features" style={{
                maxWidth: "1060px",
                margin: "0 auto 4.5rem",
                width: "92%"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#60a5fa", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        <Activity size={16} />
                        <span>Core Capabilities</span>
                    </div>
                    <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
                        Complete 4-Stage Feedback Intelligence Engine
                    </h2>
                    <p style={{ color: "#94a3b8", marginTop: "6px", fontSize: "1rem" }}>
                        From raw customer tickets to structured executive decisions.
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1.4rem"
                }}>
                    {/* Feature 1 */}
                    <div style={{
                        padding: "1.8rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                        <div style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(37, 99, 235, 0.15)",
                            color: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <UploadCloud size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "1.2rem", color: "#ffffff" }}>
                            Universal Ingestion
                        </h4>
                        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "8px", lineHeight: 1.6 }}>
                            Stream feedback from Zendesk, App Store, Intercom, or any CSV dataset. Dynamically normalizes headers and extracts content.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{
                        padding: "1.8rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                        <div style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(168, 85, 247, 0.15)",
                            color: "#a855f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Sparkles size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "1.2rem", color: "#ffffff" }}>
                            AI Classification
                        </h4>
                        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "8px", lineHeight: 1.6 }}>
                            Classifies sentiment score (-1.0 to +1.0), assigns multi-theme join mappings with confidence scores, and generates rationales.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{
                        padding: "1.8rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                        <div style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            color: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Search size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "1.2rem", color: "#ffffff" }}>
                            Ask LOOP RAG
                        </h4>
                        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "8px", lineHeight: 1.6 }}>
                            Natural language Q&A over customer sentiment. Uses vector cosine similarity to ground answers with cited feedback IDs.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div style={{
                        padding: "1.8rem",
                        borderRadius: "12px",
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                        <div style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(245, 158, 11, 0.15)",
                            color: "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <FileText size={24} />
                        </div>
                        <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "1.2rem", color: "#ffffff" }}>
                            VoC PDF Digest
                        </h4>
                        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "8px", lineHeight: 1.6 }}>
                            Automated Voice-of-Customer reports for leadership. Summarizes period volume, sentiment shifts, and key recommendations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Architecture Specs Section */}
            <section id="architecture" style={{
                maxWidth: "1060px",
                margin: "0 auto 5rem",
                width: "92%",
                padding: "2.5rem",
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                    <Cpu size={24} color="#38bdf8" />
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                        System Architecture & Engineering Specs
                    </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.8rem", marginTop: "1.5rem" }}>
                    <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.6rem" }}>
                            Frontend Architecture
                        </h4>
                        <ul style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
                            <li>React 18 + Vite with dynamic async code-splitting</li>
                            <li>Vanilla CSS Design System (clean, fast, responsive)</li>
                            <li>Lucide React Vector SVG Iconography</li>
                            <li>Recharts for responsive Area, Bar, and Donut charts</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.6rem" }}>
                            Backend & AI Pipeline
                        </h4>
                        <ul style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
                            <li>Node.js / Express API with serverless scaling</li>
                            <li>MongoDB Atlas with multi-tenant workspace isolation</li>
                            <li>FeedbackTheme join entities with confidence scoring</li>
                            <li>Vector embeddings for RAG retrieval & PDFKit digest generation</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer with Required Team Attribution */}
            <footer style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "2.5rem 2rem",
                textAlign: "center",
                fontSize: "0.9rem",
                color: "#94a3b8",
                backgroundColor: "#060911"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "14px", flexWrap: "wrap" }}>
                    <Link to="/login" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
                    <span style={{ color: "#475569" }}>•</span>
                    <Link to="/register" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}>Create Workspace</Link>
                    <span style={{ color: "#475569" }}>•</span>
                    <a
                        href="https://github.com/madhan023-mn/ai-customer-feedback"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#cbd5e1", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: 600 }}
                    >
                        <span>GitHub Repository</span>
                        <ExternalLink size={14} />
                    </a>
                </div>

                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem", marginBottom: "6px" }}>
                    All Rights Reserved — Zidio Development Engineering Team
                </div>

                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Project LOOP • AI Customer Feedback Intelligence Platform (MERN Stack)
                </div>
            </footer>
        </div>
    );
}

export default Landing;
