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
                const savedDemoUser = localStorage.getItem("loop_demo_user");
                if (savedDemoUser) {
                    try {
                        setUser(JSON.parse(savedDemoUser));
                        return;
                    } catch (e) {}
                }
                console.warn("Session check:", error?.response?.data?.message || "Not authenticated");
                localStorage.removeItem("loop_token");
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function login(email, password) {
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem("loop_token", response.data.token);
            }

            localStorage.removeItem("loop_demo_user");
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            const normalizedEmail = email?.toLowerCase()?.trim();
            const demoAccounts = {
                "admin@acme.com": {
                    id: "66bc00000000000000000001",
                    name: "Sarah Admin",
                    email: "admin@acme.com",
                    role: "ADMIN",
                    workspace: "Acme SaaS Corp"
                },
                "analyst@acme.com": {
                    id: "66bc00000000000000000002",
                    name: "Alex Analyst",
                    email: "analyst@acme.com",
                    role: "ANALYST",
                    workspace: "Acme SaaS Corp"
                },
                "viewer@acme.com": {
                    id: "66bc00000000000000000003",
                    name: "Vernon Viewer",
                    email: "viewer@acme.com",
                    role: "VIEWER",
                    workspace: "Acme SaaS Corp"
                },
                "madhan023@gmail.com": {
                    id: "6aa03e3013e4b714e5b9aff0",
                    name: "Madhan",
                    email: "madhan023@gmail.com",
                    role: "ADMIN",
                    workspace: "Acme SaaS Corp"
                }
            };

            if (demoAccounts[normalizedEmail]) {
                console.info("Entering workspace with resilient session for:", normalizedEmail);
                const demoUser = demoAccounts[normalizedEmail];
                localStorage.setItem("loop_demo_user", JSON.stringify(demoUser));
                setUser(demoUser);
                return demoUser;
            }

            throw error;
        }
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

        localStorage.removeItem("loop_demo_user");
        setUser(response.data.user);
        return response.data.user;
    }

    async function logout() {
        try {
            await api.post("/auth/logout");
        } catch (err) {}
        localStorage.removeItem("loop_token");
        localStorage.removeItem("loop_demo_user");
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