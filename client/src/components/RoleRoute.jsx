import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function RoleRoute({ allowedRoles, children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: "50vh" }}>
                <span>Loading permissions...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RoleRoute;
