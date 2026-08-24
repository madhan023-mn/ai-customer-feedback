import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingScreen from "./LoadingScreen";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <LoadingScreen
                title="Authenticating Session..."
                subtitle="Verifying cryptographic tokens and active workspace clearance"
                minHeight="60vh"
            />
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;