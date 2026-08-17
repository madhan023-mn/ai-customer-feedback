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
    Eye,
    Tag,
    Inbox,
    LineChart,
    Briefcase,
    HeartHandshake,
    Headphones,
    Award
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
            backgroundColor: "#0b0f19",
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            {/* Top Navigation Bar */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(16px)",
                backgroundColor: "rgba(11, 15, 25, 0.92)",
                borderBottom: "1px solid #1e293b",
                padding: "1rem 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                {/* Brand */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        backgroundColor: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff"
                    }}>
                        <MessageSquare size={20} />
                    </div>
                    <span style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "0.5px", color: "#ffffff" }}>
                        PROJECT LOOP
                    </span>
                </div>

                {/* Navigation Links */}
                <nav style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    fontSize: "0.9rem",
                    fontWeight: 500
                }}>
                    <a
                        href="#how-it-works"
                        style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = "#ffffff"}
                        onMouseOut={(e) => e.target.style.color = "#cbd5e1"}
                    >
                        How It Works
                    </a>
                    <a
                        href="#who-its-for"
                        style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = "#ffffff"}
                        onMouseOut={(e) => e.target.style.color = "#cbd5e1"}
                    >
                        Who It's For
                    </a>
                    <a
                        href="#demo-workspace"
                        style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = "#ffffff"}
                        onMouseOut={(e) => e.target.style.color = "#cbd5e1"}
                    >
                        Demo Access
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
                                padding: "8px 18px",
                                borderRadius: "8px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: "0.88rem"
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
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.88rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "1px solid #334155",
                                    backgroundColor: "transparent",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
                                    transition: "background 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                            >
                                <UserPlus size={15} />
                                <span>Get Started</span>
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: "4.5rem 1.5rem 2.5rem",
                textAlign: "center",
                maxWidth: "960px",
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
                    padding: "5px 14px",
                    borderRadius: "20px",
                    background: "rgba(37, 99, 235, 0.12)",
                    border: "1px solid rgba(37, 99, 235, 0.25)",
                    color: "#93c5fd",
                    fontSize: "0.82rem",
                    fontWeight: 600
                }}>
                    <MessageSquare size={14} color="#60a5fa" />
                    <span>Customer Feedback Intelligence</span>
                </div>

                <h1 style={{
                    fontSize: "3.2rem",
                    fontWeight: 800,
                    lineHeight: 1.18,
                    letterSpacing: "-0.5px",
                    color: "#ffffff",
                    margin: 0
                }}>
                    Turn customer feedback into actionable product insights.
                </h1>

                <p style={{
                    fontSize: "1.12rem",
                    color: "#94a3b8",
                    maxWidth: "760px",
                    lineHeight: 1.65,
                    margin: "0 auto"
                }}>
                    Import feedback from surveys, support tickets, app reviews, email, and social channels. LOOP automatically analyzes sentiment, identifies recurring themes, and helps your team decide what to improve next.
                </p>

                {/* Primary Action Buttons */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "0.6rem",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <Link
                        to="/register"
                        style={{
                            padding: "11px 26px",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            borderRadius: "8px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                    >
                        <span>Start Free Workspace</span>
                        <ArrowRight size={16} />
                    </Link>

                    <Link
                        to="/login"
                        style={{
                            padding: "11px 22px",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            color: "#ffffff",
                            border: "1px solid #334155",
                            backgroundColor: "#1e293b",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#334155"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    >
                        <LogIn size={16} />
                        <span>Sign In</span>
                    </Link>
                </div>

                {/* Clean Trust Pillars */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    marginTop: "1rem",
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Multi-channel feedback
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> AI-powered analysis
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#10b981" /> Secure team workspaces
                    </span>
                </div>
            </section>

            {/* Product Dashboard Preview (Clean Realistic SaaS UI Mockup) */}
            <section style={{
                maxWidth: "1020px",
                margin: "1rem auto 4.5rem",
                width: "92%"
            }}>
                <div style={{
                    backgroundColor: "#111827",
                    borderRadius: "12px",
                    border: "1px solid #1f2937",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                    overflow: "hidden"
                }}>
                    {/* Mockup Header Bar */}
                    <div style={{
                        padding: "10px 16px",
                        backgroundColor: "#0f172a",
                        borderBottom: "1px solid #1e293b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }}></div>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b" }}></div>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }}></div>
                            <span style={{ marginLeft: "10px", fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>
                                app.loop.io/dashboard — Acme SaaS Corp
                            </span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                            <Activity size={12} /> Live Ingestion Active
                        </span>
                    </div>

                    {/* Mockup Content */}
                    <div style={{ padding: "1.5rem" }}>
                        {/* Top KPI Metrics Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                                <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>TOTAL FEEDBACK</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>125</div>
                                <div style={{ fontSize: "0.75rem", color: "#38bdf8", marginTop: "2px" }}>Across 5 channels</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                                <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>POSITIVE SENTIMENT</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#34d399", marginTop: "4px" }}>58.4%</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>73 positive entries</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                                <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>NEGATIVE SENTIMENT</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f87171", marginTop: "4px" }}>24.0%</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>30 complaints tracked</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                                <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>AI CLUSTERS</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#c084fc", marginTop: "4px" }}>6 Themes</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>Confidence &gt; 0.85</div>
                            </div>
                        </div>

                        {/* Split: Themes & Recent Classification */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.2rem" }}>
                            {/* Top Customer Themes List */}
                            <div style={{ padding: "1.2rem", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.8rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span>Top Customer Themes</span>
                                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>By Volume</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: "#1e293b" }}>
                                        <span style={{ color: "#f8fafc", fontWeight: 500 }}>1. Payment Failures & Checkout</span>
                                        <span style={{ color: "#f87171", fontWeight: 700 }}>34 items</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: "#1e293b" }}>
                                        <span style={{ color: "#f8fafc", fontWeight: 500 }}>2. Mobile App Performance</span>
                                        <span style={{ color: "#fbbf24", fontWeight: 700 }}>28 items</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: "#1e293b" }}>
                                        <span style={{ color: "#f8fafc", fontWeight: 500 }}>3. Authentication & SSO Setup</span>
                                        <span style={{ color: "#38bdf8", fontWeight: 700 }}>19 items</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: "#1e293b" }}>
                                        <span style={{ color: "#f8fafc", fontWeight: 500 }}>4. Analytics & CSV Export</span>
                                        <span style={{ color: "#34d399", fontWeight: 700 }}>16 items</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live AI Classification Example */}
                            <div style={{ padding: "1.2rem", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Sparkles size={14} color="#a855f7" />
                                        <span>AI Classification & Rationale</span>
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: "#cbd5e1", fontStyle: "italic", lineHeight: 1.5, padding: "8px", borderRadius: "6px", backgroundColor: "#1e293b" }}>
                                        "MasterCard payment failed twice during checkout on the Pro annual plan."
                                    </p>
                                    <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", fontWeight: 600 }}>
                                            Negative (-0.84)
                                        </span>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#93c5fd", fontWeight: 600 }}>
                                            Theme: Payment Failure
                                        </span>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", backgroundColor: "rgba(168, 85, 247, 0.2)", color: "#d8b4fe", fontWeight: 600 }}>
                                            Area: Billing
                                        </span>
                                    </div>
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "10px", borderTop: "1px solid #1e293b", paddingTop: "8px" }}>
                                    <strong>Rationale:</strong> Customer blocked by checkout gateway timeout. High priority.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" style={{
                maxWidth: "1020px",
                margin: "0 auto 4.5rem",
                width: "92%"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#ffffff" }}>
                        From Feedback to Action
                    </h2>
                    <p style={{ color: "#94a3b8", marginTop: "6px", fontSize: "0.95rem" }}>
                        A simple workflow for turning raw customer feedback into product insights.
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.2rem"
                }}>
                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            01 — Import Feedback
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: "#ffffff" }}>
                            Multi-Channel Intake
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Upload customer feedback from surveys, support tickets, app reviews, email, and social channels.
                        </p>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            02 — Analyze Automatically
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: "#ffffff" }}>
                            Sentiment & Themes
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Detect sentiment, classify feedback, identify recurring themes, and measure confidence scores.
                        </p>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            03 — Ask Your Feedback Data
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: "#ffffff" }}>
                            Natural Language Search
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Search customer feedback using natural language and find the conversations behind each insight.
                        </p>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            04 — Share the Insights
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: "#ffffff" }}>
                            Executive Reports
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.55 }}>
                            Generate reports with key trends, recurring issues, volume shifts, and recommended actions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Who It's For Section */}
            <section id="who-its-for" style={{
                maxWidth: "1020px",
                margin: "0 auto 4.5rem",
                width: "92%"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#ffffff" }}>
                        Built for teams that listen to customers
                    </h2>
                    <p style={{ color: "#94a3b8", marginTop: "6px", fontSize: "0.95rem" }}>
                        Help every department prioritize what matters most to your users.
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.2rem"
                }}>
                    <div style={{ padding: "1.4rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                            <Briefcase size={18} />
                        </div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>Product Teams</h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.5 }}>
                            Identify recurring problems, validate feature requests, and prioritize roadmap items with confidence.
                        </p>
                    </div>

                    <div style={{ padding: "1.4rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                            <HeartHandshake size={18} />
                        </div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>Customer Success</h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.5 }}>
                            Understand customer complaints, track satisfaction shifts, and prevent churn before renewals.
                        </p>
                    </div>

                    <div style={{ padding: "1.4rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                            <Headphones size={18} />
                        </div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>Support Teams</h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.5 }}>
                            Group common issues across tickets, identify knowledge base gaps, and streamline triage.
                        </p>
                    </div>

                    <div style={{ padding: "1.4rem", borderRadius: "10px", backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                            <Award size={18} />
                        </div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>Leadership</h4>
                        <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginTop: "6px", lineHeight: 1.5 }}>
                            Get a concise, aggregated view of customer sentiment, emerging issues, and product impact.
                        </p>
                    </div>
                </div>
            </section>

            {/* Explore a Demo Workspace Section */}
            <section id="demo-workspace" style={{
                maxWidth: "1020px",
                margin: "0 auto 4.5rem",
                width: "92%",
                padding: "2.2rem",
                backgroundColor: "#111827",
                borderRadius: "12px",
                border: "1px solid #1f2937",
                textAlign: "center"
            }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    <Zap size={14} color="#38bdf8" />
                    <span>Interactive Demo</span>
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
                    Explore a Demo Workspace
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", maxWidth: "640px", margin: "6px auto 1.8rem" }}>
                    See how LOOP turns customer feedback into insights, themes, and actionable recommendations across 125 sample customer feedback entries.
                </p>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    flexWrap: "wrap"
                }}>
                    <button
                        onClick={() => handleDemoLogin("admin@acme.com")}
                        style={{
                            padding: "10px 22px",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                    >
                        <Shield size={16} />
                        <span>Admin Demo</span>
                    </button>

                    <button
                        onClick={() => handleDemoLogin("analyst@acme.com")}
                        style={{
                            padding: "10px 22px",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            backgroundColor: "#1e293b",
                            color: "#ffffff",
                            border: "1px solid #334155",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#334155"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    >
                        <Sparkles size={16} color="#a855f7" />
                        <span>Analyst Demo</span>
                    </button>

                    <button
                        onClick={() => handleDemoLogin("viewer@acme.com")}
                        style={{
                            padding: "10px 22px",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            backgroundColor: "#1e293b",
                            color: "#ffffff",
                            border: "1px solid #334155",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#334155"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    >
                        <Eye size={16} color="#94a3b8" />
                        <span>Viewer Demo</span>
                    </button>
                </div>
            </section>

            {/* Architecture Section */}
            <section id="architecture" style={{
                maxWidth: "1020px",
                margin: "0 auto 4.5rem",
                width: "92%",
                padding: "2rem",
                backgroundColor: "#0f172a",
                borderRadius: "12px",
                border: "1px solid #1e293b"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.8rem" }}>
                    <Cpu size={20} color="#38bdf8" />
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                        Technical Architecture
                    </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1.2rem" }}>
                    <div>
                        <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.4rem" }}>
                            Frontend Architecture
                        </h4>
                        <ul style={{ fontSize: "0.84rem", color: "#94a3b8", lineHeight: 1.7, paddingLeft: "1.2rem", margin: 0 }}>
                            <li>React 18 with Vite async code-splitting</li>
                            <li>Vanilla CSS Design System (clean and responsive)</li>
                            <li>Lucide React SVG iconography</li>
                            <li>Recharts for responsive Area, Bar, and Donut visualizations</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.4rem" }}>
                            Backend & Intelligence
                        </h4>
                        <ul style={{ fontSize: "0.84rem", color: "#94a3b8", lineHeight: 1.7, paddingLeft: "1.2rem", margin: 0 }}>
                            <li>Node.js / Express API with serverless scaling</li>
                            <li>MongoDB Atlas with multi-tenant workspace isolation</li>
                            <li>FeedbackTheme join model with confidence scoring</li>
                            <li>Vector embeddings for natural language search & PDF reporting</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section style={{
                textAlign: "center",
                padding: "2rem 1.5rem 4rem",
                maxWidth: "700px",
                margin: "0 auto"
            }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff" }}>
                    Turn customer feedback into better decisions.
                </h2>
                <p style={{ fontSize: "0.95rem", color: "#94a3b8", marginTop: "6px" }}>
                    Create a workspace in seconds or explore with sample data.
                </p>
                <div style={{ marginTop: "1.4rem" }}>
                    <Link
                        to="/register"
                        style={{
                            padding: "12px 28px",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            borderRadius: "8px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff"
                        }}
                    >
                        <span>Create Free Workspace</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Footer with Required Team Attribution */}
            <footer style={{
                marginTop: "auto",
                borderTop: "1px solid #1e293b",
                padding: "2rem",
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#94a3b8",
                backgroundColor: "#080c14"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <Link to="/login" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 500 }}>Sign In</Link>
                    <span style={{ color: "#475569" }}>•</span>
                    <Link to="/register" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 500 }}>Create Workspace</Link>
                    <span style={{ color: "#475569" }}>•</span>
                    <a
                        href="https://github.com/madhan023-mn/ai-customer-feedback"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#cbd5e1", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 500 }}
                    >
                        <span>GitHub Repository</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.9rem", marginBottom: "4px" }}>
                    All Rights Reserved — Zidio Development Engineering Team
                </div>

                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    Project LOOP • Customer Feedback Intelligence Platform (MERN Stack)
                </div>
            </footer>
        </div>
    );
}

export default Landing;
