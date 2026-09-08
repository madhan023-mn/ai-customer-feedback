import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft, LayoutDashboard } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="main-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh", textAlign: "center", padding: "2rem" }}>
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
            }}>
                <AlertCircle size={44} color="var(--primary)" />
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-main)" }}>
                404 — Page Not Found
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "480px", marginBottom: "28px", lineHeight: "1.6" }}>
                The page or resource you are looking for does not exist or has been moved.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                <button
                    type="button"
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate("/");
                        }
                    }}
                    className="btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
                >
                    <ArrowLeft size={16} />
                    <span>Go Back</span>
                </button>
                <Link
                    to="/"
                    className="btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", textDecoration: "none" }}
                >
                    <Home size={16} />
                    <span>Return to Main Page</span>
                </Link>
                <Link
                    to="/dashboard"
                    className="btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", width: "auto" }}
                >
                    <LayoutDashboard size={16} />
                    <span>Workspace Dashboard</span>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
