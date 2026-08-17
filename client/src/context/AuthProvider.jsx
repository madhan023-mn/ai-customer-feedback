import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../services/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/me")
            .then((response) => {
                setUser(response.data.user);
            })
            .catch((error) => {
                console.warn("Session check:", error?.response?.data?.message || "Not authenticated");
                localStorage.removeItem("loop_token");
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        if (response.data.token) {
            localStorage.setItem("loop_token", response.data.token);
        }

        setUser(response.data.user);
        return response.data.user;
    }

    async function register(name, email, password, workspaceName) {
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
            workspaceName
        });

        if (response.data.token) {
            localStorage.setItem("loop_token", response.data.token);
        }

        setUser(response.data.user);
        return response.data.user;
    }

    async function logout() {
        try {
            await api.post("/auth/logout");
        } catch (err) {}
        localStorage.removeItem("loop_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}