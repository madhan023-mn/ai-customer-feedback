import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

function NotFound() {
    return (
        <div className="main-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
            <AlertCircle size={64} color="var(--primary)" style={{ marginBottom: "16px" }} />
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>404 — Page Not Found</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "480px", marginBottom: "24px" }}>
                The page or resource you are looking for does not exist or has been moved.
            </p>
            <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}>
                <Home size={18} />
                <span>Return to Dashboard</span>
            </Link>
        </div>
    );
}

export default NotFound;
