import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { MessageSquare, AlertCircle, Mail, Lock, LogIn } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-brand">
                        <MessageSquare size={28} />
                    </div>
                    <h1>Welcome to LOOP</h1>
                    <p>Customer Feedback Intelligence Platform</p>
                </div>

                {error && (
                    <div className="alert-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Mail size={14} color="var(--text-muted)" />
                            <span>Work Email</span>
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Lock size={14} color="var(--text-muted)" />
                            <span>Password</span>
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        <LogIn size={18} />
                        <span>{loading ? "Signing in..." : "Sign In to Workspace"}</span>
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Create new workspace</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;