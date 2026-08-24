import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingScreen from "./LoadingScreen";

function RoleRoute({ allowedRoles, children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <LoadingScreen
                title="Checking Access Permissions..."
                subtitle="Verifying organizational role clearance"
                minHeight="50vh"
            />
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
}

export default RoleRoute;
