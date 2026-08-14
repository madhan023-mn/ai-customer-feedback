import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import {
    UserPlus,
    Users,
    Trash2,
    AlertCircle,
    Loader2,
    User,
    Mail,
    Lock,
    Shield
} from "lucide-react";

function Members() {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "VIEWER"
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        api.get("/members")
            .then((res) => {
                setMembers(res.data.members || []);
            })
            .catch((err) => {
                console.error("Get members error:", err);
                setError(err.response?.data?.message || "Failed to load team members");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleAddMember(e) {
        e.preventDefault();
        try {
            setFormLoading(true);
            setError("");

            await api.post("/members", form);
            setForm({ name: "", email: "", password: "", role: "VIEWER" });
            setShowForm(false);

            const res = await api.get("/members");
            setMembers(res.data.members || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member");
        } finally {
            setFormLoading(false);
        }
    }

    async function handleRoleChange(memberId, newRole) {
        try {
            setError("");
            await api.patch(`/members/${memberId}/role`, { role: newRole });
            const res = await api.get("/members");
            setMembers(res.data.members || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update role");
        }
    }

    async function handleDelete(memberId) {
        if (!window.confirm("Are you sure you want to remove this team member?")) return;

        try {
            setError("");
            await api.delete(`/members/${memberId}`);
            setMembers(members.filter(m => m._id !== memberId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove member");
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Members</h1>
                    <p className="page-subtitle">
                        Manage user permissions and access control in {user?.workspace}
                    </p>
                </div>

                {user?.role === "ADMIN" && (
                    <button
                        className="btn-primary"
                        style={{ width: "auto", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        <UserPlus size={16} />
                        <span>{showForm ? "Cancel" : "Invite Team Member"}</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Add Member Form Modal / Section */}
            {showForm && user?.role === "ADMIN" && (
                <div className="auth-card" style={{ maxWidth: "600px", marginBottom: "2rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                        Invite New Team Member
                    </h3>
                    <form onSubmit={handleAddMember}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <User size={13} />
                                    <span>Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input-field"
                                    placeholder="Sarah Connor"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Mail size={13} />
                                    <span>Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="sarah@company.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Lock size={13} />
                                    <span>Temporary Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input-field"
                                    placeholder="Min 8 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Shield size={13} />
                                    <span>Assigned Role</span>
                                </label>
                                <select
                                    name="role"
                                    className="select-field"
                                    value={form.role}
                                    onChange={handleChange}
                                >
                                    <option value="ADMIN">ADMIN (Full Access)</option>
                                    <option value="ANALYST">ANALYST (Read & Edit)</option>
                                    <option value="VIEWER">VIEWER (Read Only)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={formLoading}
                            style={{ marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                            <UserPlus size={16} />
                            <span>{formLoading ? "Adding..." : "Add Team Member"}</span>
                        </button>
                    </form>
                </div>
            )}

            {/* Members Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                {user?.role === "ADMIN" && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="empty-state">
                                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                                            <span>Loading team members...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="empty-state">
                                        No members found.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member._id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div className="user-avatar" style={{ width: "32px", height: "32px" }}>
                                                    {member.name ? member.name.charAt(0).toUpperCase() : <User size={16} />}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{member.name}</span>
                                            </div>
                                        </td>
                                        <td>{member.email}</td>
                                        <td>
                                            {user?.role === "ADMIN" &&
                                             member._id?.toString() !== (user?.id || user?._id)?.toString() ? (
                                                <select
                                                    className="select-field"
                                                    style={{ padding: "4px 8px", fontSize: "0.8rem", width: "auto" }}
                                                    value={member.role}
                                                    onChange={(e) => handleRoleChange(member._id, e.target.value)}
                                                >
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="ANALYST">ANALYST</option>
                                                    <option value="VIEWER">VIEWER</option>
                                                </select>
                                            ) : (
                                                <span className={`role-pill ${
                                                    member.role === "ADMIN" ? "role-admin" :
                                                    member.role === "ANALYST" ? "role-analyst" : "role-viewer"
                                                }`}>
                                                    {member.role}
                                                </span>
                                            )}
                                        </td>

                                        {user?.role === "ADMIN" && (
                                            <td>
                                                {member._id?.toString() !== (user?.id || user?._id)?.toString() ? (
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => handleDelete(member._id)}
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                                                    >
                                                        <Trash2 size={13} />
                                                        <span>Remove</span>
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
                                                        (You)
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Members;