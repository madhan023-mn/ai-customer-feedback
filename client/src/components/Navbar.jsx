import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import {
    MessageSquare,
    LayoutDashboard,
    PlusCircle,
    Users,
    LogOut,
    User,
    Layers,
    Sparkles,
    FileText,
    BarChart3,
    Menu,
    X,
    HelpCircle,
    Sun,
    Moon
} from "lucide-react";

function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    if (!user) return null;

    const navSections = [
        {
            title: "OVERVIEW",
            links: [
                { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                { path: "/feedback", label: "Feedback Hub", icon: MessageSquare }
            ]
        },
        {
            title: "INTELLIGENCE",
            links: [
                { path: "/analytics", label: "Analytics & Trends", icon: BarChart3 },
                { path: "/themes", label: "Theme Explorer", icon: Layers },
                { path: "/insights", label: "AI Insights", icon: Sparkles },
                { path: "/ask", label: "Ask LOOP", icon: HelpCircle },
                { path: "/reports", label: "Executive Reports", icon: FileText }
            ]
        },
        {
            title: "MANAGEMENT",
            links: [
                { path: "/feedback/add", label: "Add / Import", icon: PlusCircle },
                { path: "/members", label: "Team Members", icon: Users }
            ]
        }
    ];

    const getRoleClass = (role) => {
        switch (role) {
            case "ADMIN": return "role-admin";
            case "ANALYST": return "role-analyst";
            default: return "role-viewer";
        }
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="mobile-top-bar">
                <Link to="/dashboard" className="nav-brand">
                    <div className="brand-icon">
                        <MessageSquare size={18} color="white" />
                    </div>
                    <span className="brand-title">LOOP</span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: "transparent",
                            border: "1px solid var(--border-light)",
                            color: "var(--text-main)",
                            borderRadius: "6px",
                            padding: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <button
                        className="mobile-toggle-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation sidebar"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Backdrop Overlay for Mobile Drawer */}
            {mobileOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Vertical Sidebar */}
            <aside className={`app-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
                {/* Top Brand Header */}
                <div className="sidebar-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link to="/dashboard" className="nav-brand">
                        <div className="brand-icon">
                            <MessageSquare size={20} color="white" />
                        </div>
                        <div>
                            <span className="brand-title">LOOP</span>
                            <span className="brand-subtext">Feedback Intelligence</span>
                        </div>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        style={{
                            background: "transparent",
                            border: "1px solid var(--border-light)",
                            color: "var(--text-muted)",
                            borderRadius: "6px",
                            padding: "5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                        }}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        {theme === "dark" ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#6366f1" />}
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-menu">
                    {navSections.map((section, idx) => (
                        <div key={idx} className="sidebar-section">
                            <span className="sidebar-section-title">{section.title}</span>
                            {section.links.map((link) => {
                                const IconComp = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`sidebar-link ${isActive ? "active" : ""}`}
                                    >
                                        <IconComp size={18} className="sidebar-icon" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom Pinned User Profile Card */}
                <div className="sidebar-user-card">
                    <div className="user-badge-vertical">
                        <div className="user-avatar-main">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                        </div>
                        <div className="user-details">
                            <span className="user-display-name">{user.name}</span>
                            <span className="user-workspace-name">{user.workspace || "Workspace"}</span>
                        </div>
                        <span className={`role-pill ${getRoleClass(user.role)}`}>
                            {user.role}
                        </span>
                    </div>

                    <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Navbar;
