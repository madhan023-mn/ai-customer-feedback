import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import {
    MessageSquare,
    Sparkles,
    Search,
    FileText,
    UploadCloud,
    ArrowRight,
    CheckCircle2,
    LogIn,
    UserPlus,
    Activity,
    Shield,
    ExternalLink,
    Eye,
    Sun,
    Moon
} from "lucide-react";

function Landing() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    const colors = {
        bg: isDark ? "#0b0f19" : "#f8fafc",
        cardBg: isDark ? "#111827" : "#ffffff",
        innerBg: isDark ? "#0f172a" : "#f1f5f9",
        border: isDark ? "#1f2937" : "#e2e8f0",
        textMain: isDark ? "#ffffff" : "#0f172a",
        textMuted: isDark ? "#94a3b8" : "#64748b",
        headerBg: isDark ? "rgba(11, 15, 25, 0.95)" : "rgba(255, 255, 255, 0.95)",
        footerBg: isDark ? "#080c14" : "#f1f5f9",
        btnSecondaryBg: isDark ? "#1e293b" : "#ffffff",
        btnSecondaryBorder: isDark ? "#334155" : "#cbd5e1"
    };

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
            backgroundColor: colors.bg,
            color: colors.textMain,
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            transition: "background-color 0.2s, color 0.2s"
        }}>
            {/* Header */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(16px)",
                backgroundColor: colors.headerBg,
                borderBottom: `1px solid ${colors.border}`,
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
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.5px", color: colors.textMain }}>
                        PROJECT LOOP
                    </span>
                </div>

                {/* Navigation Links */}
                <nav style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.8rem",
                    fontSize: "0.9rem",
                    fontWeight: 600
                }}>
                    <a
                        href="#features"
                        style={{ color: colors.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = colors.textMain}
                        onMouseOut={(e) => e.target.style.color = colors.textMuted}
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        style={{ color: colors.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = colors.textMain}
                        onMouseOut={(e) => e.target.style.color = colors.textMuted}
                    >
                        How It Works
                    </a>
                    <a
                        href="#demo-workspace"
                        style={{ color: colors.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.target.style.color = colors.textMain}
                        onMouseOut={(e) => e.target.style.color = colors.textMuted}
                    >
                        Demo Access
                    </a>
                </nav>

                {/* Right Action Buttons + Theme Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: colors.btnSecondaryBg,
                            border: `1px solid ${colors.btnSecondaryBorder}`,
                            color: colors.textMain,
                            borderRadius: "8px",
                            padding: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                        }}
                        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#3b82f6" />}
                    </button>

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
                                    color: colors.textMain,
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.88rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: `1px solid ${colors.btnSecondaryBorder}`,
                                    backgroundColor: colors.btnSecondaryBg,
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
                {/* Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 14px",
                    borderRadius: "20px",
                    background: "rgba(37, 99, 235, 0.12)",
                    border: "1px solid rgba(37, 99, 235, 0.25)",
                    color: "#3b82f6",
                    fontSize: "0.84rem",
                    fontWeight: 700
                }}>
                    <MessageSquare size={14} />
                    <span>Customer Feedback Intelligence</span>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: "3.1rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                    color: colors.textMain,
                    margin: 0
                }}>
                    Understand customer feedback, identify recurring issues, and make better product decisions.
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: "1.12rem",
                    color: colors.textMuted,
                    maxWidth: "760px",
                    lineHeight: 1.65,
                    margin: "0 auto"
                }}>
                    Import feedback from surveys, support tickets, app reviews, email, and social channels. LOOP automatically analyzes sentiment, identifies recurring themes, and helps your team decide what to improve next.
                </p>

                {/* Hero Actions */}
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
                        <span>Get Started</span>
                        <ArrowRight size={16} />
                    </Link>

                    <Link
                        to="/login"
                        style={{
                            padding: "11px 22px",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            color: colors.textMain,
                            border: `1px solid ${colors.btnSecondaryBorder}`,
                            backgroundColor: colors.btnSecondaryBg,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                    >
                        <LogIn size={16} />
                        <span>Sign In</span>
                    </Link>
                </div>

                {/* Trust Pillars */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    marginTop: "1rem",
                    fontSize: "0.85rem",
                    color: colors.textMuted,
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
                    backgroundColor: colors.cardBg,
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.4)" : "0 10px 30px rgba(0, 0, 0, 0.06)",
                    overflow: "hidden"
                }}>
                    {/* Mockup Header Bar */}
                    <div style={{
                        padding: "10px 16px",
                        backgroundColor: colors.innerBg,
                        borderBottom: `1px solid ${colors.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }}></div>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b" }}></div>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }}></div>
                            <span style={{ marginLeft: "10px", fontSize: "0.8rem", color: colors.textMuted, fontWeight: 500 }}>
                                app.loop.io/dashboard — Acme SaaS Corp
                            </span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                            <Activity size={12} /> Live Ingestion Active
                        </span>
                    </div>

                    {/* Mockup Content */}
                    <div style={{ padding: "1.5rem" }}>
                        {/* Top KPI Metrics Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}` }}>
                                <div style={{ fontSize: "0.78rem", color: colors.textMuted, fontWeight: 600 }}>TOTAL FEEDBACK</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: colors.textMain, marginTop: "4px" }}>125</div>
                                <div style={{ fontSize: "0.75rem", color: "#3b82f6", marginTop: "2px" }}>Across 5 channels</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}` }}>
                                <div style={{ fontSize: "0.78rem", color: colors.textMuted, fontWeight: 600 }}>POSITIVE SENTIMENT</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>58.4%</div>
                                <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "2px" }}>73 positive entries</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}` }}>
                                <div style={{ fontSize: "0.78rem", color: colors.textMuted, fontWeight: 600 }}>NEGATIVE SENTIMENT</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ef4444", marginTop: "4px" }}>24.0%</div>
                                <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "2px" }}>30 complaints tracked</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}` }}>
                                <div style={{ fontSize: "0.78rem", color: colors.textMuted, fontWeight: 600 }}>AI CLUSTERS</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#8b5cf6", marginTop: "4px" }}>6 Themes</div>
                                <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "2px" }}>Confidence &gt; 0.85</div>
                            </div>
                        </div>

                        {/* Split: Themes & Recent Classification */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.2rem" }}>
                            {/* Top Customer Themes List */}
                            <div style={{ padding: "1.2rem", borderRadius: "8px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}` }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMain, marginBottom: "0.8rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span>Top Customer Themes</span>
                                    <span style={{ fontSize: "0.75rem", color: colors.textMuted }}>By Volume</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                                        <span style={{ color: colors.textMain, fontWeight: 500 }}>1. Payment Failures & Checkout</span>
                                        <span style={{ color: "#ef4444", fontWeight: 700 }}>34 items</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                                        <span style={{ color: colors.textMain, fontWeight: 500 }}>2. Mobile App Performance</span>
                                        <span style={{ color: "#f59e0b", fontWeight: 700 }}>28 items</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                                        <span style={{ color: colors.textMain, fontWeight: 500 }}>3. Authentication & SSO Setup</span>
                                        <span style={{ color: "#3b82f6", fontWeight: 700 }}>19 items</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", padding: "6px 10px", borderRadius: "6px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                                        <span style={{ color: colors.textMain, fontWeight: 500 }}>4. Analytics & CSV Export</span>
                                        <span style={{ color: "#10b981", fontWeight: 700 }}>16 items</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live AI Classification Example */}
                            <div style={{ padding: "1.2rem", borderRadius: "8px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMain, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Sparkles size={14} color="#8b5cf6" />
                                        <span>AI Classification & Rationale</span>
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: colors.textMain, fontStyle: "italic", lineHeight: 1.5, padding: "8px", borderRadius: "6px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                                        "MasterCard payment failed twice during checkout on the Pro annual plan."
                                    </p>
                                    <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", fontWeight: 600 }}>
                                            Negative (-0.84)
                                        </span>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", fontWeight: 600 }}>
                                            Theme: Payment Failure
                                        </span>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6", fontWeight: 600 }}>
                                            Area: Billing
                                        </span>
                                    </div>
                                </div>
                                <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "10px", borderTop: `1px solid ${colors.border}`, paddingTop: "8px" }}>
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
                    <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: colors.textMain }}>
                        How It Works
                    </h2>
                    <p style={{ color: colors.textMuted, marginTop: "6px", fontSize: "0.95rem" }}>
                        Collect → Analyze → Explore → Act
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.2rem"
                }}>
                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            01 — Collect
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: colors.textMain }}>
                            Multi-Channel Intake
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: colors.textMuted, marginTop: "6px", lineHeight: 1.55 }}>
                            Upload customer feedback from surveys, support tickets, app reviews, email, and social channels.
                        </p>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            02 — Analyze
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: colors.textMain }}>
                            Sentiment & Themes
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: colors.textMuted, marginTop: "6px", lineHeight: 1.55 }}>
                            Detect sentiment, classify feedback, identify recurring themes, and measure confidence scores.
                        </p>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            03 — Explore
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: colors.textMain }}>
                            Natural Language Search
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: colors.textMuted, marginTop: "6px", lineHeight: 1.55 }}>
                            Search customer feedback using natural language and find the conversations behind each insight.
                        </p>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "10px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            04 — Act
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.6rem", color: colors.textMain }}>
                            Executive Reports
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: colors.textMuted, marginTop: "6px", lineHeight: 1.55 }}>
                            Generate reports with key trends, recurring issues, volume shifts, and recommended actions.
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
                backgroundColor: colors.cardBg,
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                textAlign: "center"
            }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: colors.textMain }}>
                    Explore a Demo Workspace
                </h3>
                <p style={{ fontSize: "0.9rem", color: colors.textMuted, maxWidth: "640px", margin: "6px auto 1.8rem" }}>
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
                            backgroundColor: colors.btnSecondaryBg,
                            color: colors.textMain,
                            border: `1px solid ${colors.btnSecondaryBorder}`,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                    >
                        <Sparkles size={16} color="#8b5cf6" />
                        <span>Analyst Demo</span>
                    </button>

                    <button
                        onClick={() => handleDemoLogin("viewer@acme.com")}
                        style={{
                            padding: "10px 22px",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            backgroundColor: colors.btnSecondaryBg,
                            color: colors.textMain,
                            border: `1px solid ${colors.btnSecondaryBorder}`,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s"
                        }}
                    >
                        <Eye size={16} color={colors.textMuted} />
                        <span>Viewer Demo</span>
                    </button>
                </div>
            </section>

            {/* Final CTA Section */}
            <section style={{
                textAlign: "center",
                padding: "2rem 1.5rem 4rem",
                maxWidth: "700px",
                margin: "0 auto"
            }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: colors.textMain }}>
                    Turn customer feedback into actionable insights.
                </h2>
                <p style={{ fontSize: "0.95rem", color: colors.textMuted, marginTop: "6px" }}>
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
                        <span>Get Started</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                marginTop: "auto",
                borderTop: `1px solid ${colors.border}`,
                padding: "2rem",
                textAlign: "center",
                fontSize: "0.85rem",
                color: colors.textMuted,
                backgroundColor: colors.footerBg
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <Link to="/login" style={{ color: colors.textMain, textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
                    <span style={{ color: colors.border }}>•</span>
                    <Link to="/register" style={{ color: colors.textMain, textDecoration: "none", fontWeight: 600 }}>Get Started</Link>
                    <span style={{ color: colors.border }}>•</span>
                    <a
                        href="https://github.com/madhan023-mn/ai-customer-feedback"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colors.textMain, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }}
                    >
                        <span>GitHub</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <div style={{ fontWeight: 700, color: colors.textMain, fontSize: "0.9rem", marginBottom: "4px" }}>
                    All Rights Reserved — Zidio Development Engineering Team
                </div>

                <div style={{ fontSize: "0.78rem", color: colors.textMuted }}>
                    Project LOOP • Customer Feedback Intelligence Platform (MERN Stack)
                </div>
            </footer>
        </div>
    );
}

export default Landing;
