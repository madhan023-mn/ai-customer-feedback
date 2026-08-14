import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { MessageSquare, AlertCircle, User, Briefcase, Mail, Lock, UserPlus } from "lucide-react";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        workspaceName: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(
                form.name,
                form.email,
                form.password,
                form.workspaceName
            );
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
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
                    <h1>Create Workspace</h1>
                    <p>Start collecting and analyzing feedback in minutes</p>
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
                            <User size={14} color="var(--text-muted)" />
                            <span>Full Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            placeholder="Alex Morgan"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Briefcase size={14} color="var(--text-muted)" />
                            <span>Workspace Name</span>
                        </label>
                        <input
                            type="text"
                            name="workspaceName"
                            className="input-field"
                            placeholder="Acme Corp"
                            value={form.workspaceName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Mail size={14} color="var(--text-muted)" />
                            <span>Work Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            placeholder="alex@acme.com"
                            value={form.email}
                            onChange={handleChange}
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
                            name="password"
                            className="input-field"
                            placeholder="Minimum 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        <UserPlus size={18} />
                        <span>{loading ? "Creating workspace..." : "Create Workspace"}</span>
                    </button>
                </form>

                <div className="auth-footer">
                    Already have a workspace?{" "}
                    <Link to="/">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;