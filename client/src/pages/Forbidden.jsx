import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

function Forbidden() {
    return (
        <div className="main-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
            <ShieldAlert size={64} color="#dc2626" style={{ marginBottom: "16px" }} />
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px", color: "#dc2626" }}>403 — Access Forbidden</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "480px", marginBottom: "24px" }}>
                You do not have sufficient role permissions (RBAC) to view this page or execute this action.
            </p>
            <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}>
                <Home size={18} />
                <span>Return to Dashboard</span>
            </Link>
        </div>
    );
}

export default Forbidden;
