import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import {
    Search,
    PlusCircle,
    Smile,
    Meh,
    Frown,
    Trash2,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader2,
    X,
    Cpu,
    RotateCcw,
    Layers,
    Tag
} from "lucide-react";

function Feedback() {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter states
    const [search, setSearch] = useState("");
    const [channel, setChannel] = useState("ALL");
    const [sentiment, setSentiment] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [featureArea, setFeatureArea] = useState("ALL");
    const [aiStatusFilter, setAiStatusFilter] = useState("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Pagination states
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Modal state for delete confirmation
    const [deleteId, setDeleteId] = useState(null);
    const [analyzingId, setAnalyzingId] = useState(null);

    // Batch AI processing states
    const [batchLoading, setBatchLoading] = useState(false);
    const [batchMessage, setBatchMessage] = useState("");

    const canEdit = user?.role === "ADMIN" || user?.role === "ANALYST";
    const isAdmin = user?.role === "ADMIN";

    async function analyzeFeedback(id) {
        if (!canEdit) return;
        try {
            setAnalyzingId(id);
            setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, aiStatus: "PROCESSING" } : f));
            const res = await api.post(`/feedback/${id}/analyze`);
            const updated = res.data.feedback;
            if (updated) {
                setFeedbacks(prev => prev.map(f => f._id === id ? updated : f));
            } else {
                fetchFeedbacks();
            }
        } catch (err) {
            try {
                const res = await api.post(`/ai/feedback/${id}/analyze`);
                const updated = res.data.feedback;
                if (updated) {
                    setFeedbacks(prev => prev.map(f => f._id === id ? updated : f));
                } else {
                    fetchFeedbacks();
                }
            } catch (aiErr) {
                setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, aiStatus: "FAILED" } : f));
                alert(err.response?.data?.message || aiErr.response?.data?.message || "Failed to analyze feedback");
            }
        } finally {
            setAnalyzingId(null);
        }
    }

    async function analyzePending() {
        if (!canEdit) return;
        try {
            setBatchLoading(true);
            setBatchMessage("");

            const response = await api.post("/ai/feedback/analyze-pending", { limit: 10 });

            setBatchMessage(
                `Processed ${response.data.processed} feedback. ${response.data.successful} successful, ${response.data.failed} failed.`
            );

            fetchFeedbacks();
        } catch (err) {
            setBatchMessage(
                err.response?.data?.message || "Batch analysis failed"
            );
        } finally {
            setBatchLoading(false);
        }
    }

    async function fetchFeedbacks() {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                limit: 15,
                search,
                channel,
                sentiment,
                status,
                featureArea,
                aiStatus: aiStatusFilter
            });

            if (fromDate) queryParams.append("fromDate", fromDate);
            if (toDate) queryParams.append("toDate", toDate);

            const res = await api.get(`/feedback?${queryParams.toString()}`);
            setFeedbacks(res.data.feedbacks || res.data.feedback || []);
            setTotalPages(res.data.pages || res.data.pagination?.totalPages || 1);
            setTotalItems(res.data.total || res.data.pagination?.total || 0);
        } catch (err) {
            console.error("Fetch feedback error:", err);
            setError(err.response?.data?.message || "Failed to load feedback");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFeedbacks();
    }, [page, channel, sentiment, status, featureArea, aiStatusFilter, fromDate, toDate]);

    function handleSearchSubmit(e) {
        e.preventDefault();
        setPage(1);
        fetchFeedbacks();
    }

    async function handleStatusChange(id, newStatus) {
        if (!canEdit) return;
        try {
            await api.patch(`/feedback/${id}`, { status: newStatus });
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    }

    async function confirmDelete() {
        if (!deleteId || !isAdmin) return;
        try {
            await api.delete(`/feedback/${deleteId}`);
            setFeedbacks(feedbacks.filter(f => f._id !== deleteId));
            setTotalItems(prev => prev - 1);
            setDeleteId(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete feedback");
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Feedback Hub</h1>
                    <p className="page-subtitle">
                        Manage, filter, and extract actionable insights from customer feedback ({totalItems} records)
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    {canEdit && (
                        <>
                            <button
                                className="btn-secondary"
                                onClick={analyzePending}
                                disabled={batchLoading}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Cpu size={16} />
                                <span>{batchLoading ? "Analyzing..." : "Analyze Pending"}</span>
                            </button>

                            <Link to="/feedback/add" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <PlusCircle size={16} />
                                <span>Add / Import Feedback</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {batchMessage && (
                <div className="alert-success" style={{ marginBottom: "1rem", padding: "10px 14px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", fontSize: "0.9rem" }}>
                    {batchMessage}
                </div>
            )}

            {error && (
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Filter Bar */}
            <div className="filter-bar">
                <form onSubmit={handleSearchSubmit} className="search-wrapper">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search feedback, customer, feature..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={featureArea}
                        onChange={(e) => { setFeatureArea(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Themes</option>
                        <option value="Checkout">Checkout</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Search">Search</option>
                        <option value="Payments">Payments</option>
                        <option value="Authentication">Authentication</option>
                        <option value="Support">Support</option>
                        <option value="Notifications">Notifications</option>
                        <option value="Performance">Performance</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        className="filter-select"
                        value={channel}
                        onChange={(e) => { setChannel(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Channels</option>
                        <option value="SUPPORT_TICKET">Support Tickets</option>
                        <option value="APP_STORE">App Store</option>
                        <option value="NPS_SURVEY">NPS Survey</option>
                        <option value="SALES_CALL">Sales Calls</option>
                        <option value="COMMUNITY">Community</option>
                    </select>

                    <select
                        className="filter-select"
                        value={sentiment}
                        onChange={(e) => { setSentiment(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Sentiments</option>
                        <option value="POS">Positive</option>
                        <option value="NEU">Neutral</option>
                        <option value="NEG">Negative</option>
                    </select>

                    <select
                        className="filter-select"
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="NEW">NEW</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ACTIONED">ACTIONED</option>
                    </select>

                    <select
                        className="filter-select"
                        value={aiStatusFilter}
                        onChange={(e) => { setAiStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All AI Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                    </select>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>From:</span>
                        <input
                            type="date"
                            className="filter-select"
                            style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                            value={fromDate}
                            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>To:</span>
                        <input
                            type="date"
                            className="filter-select"
                            style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                            value={toDate}
                            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                        />
                    </div>

                    {(fromDate || toDate) && (
                        <button
                            className="btn-secondary"
                            style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                            onClick={() => { setFromDate(""); setToDate(""); setPage(1); }}
                        >
                            Reset Dates
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Feedback & Insights</th>
                                <th>Channel</th>
                                <th>Customer Label</th>
                                <th>Sentiment</th>
                                <th>Status Action</th>
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="empty-state">
                                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                                            <span>Loading records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : feedbacks.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="empty-state">
                                        No feedback matching your filters. {canEdit && <Link to="/feedback/add">Add new feedback</Link>}.
                                    </td>
                                </tr>
                            ) : (
                                feedbacks.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="feedback-content-text">{item.content}</div>
                                            <div style={{ marginTop: "8px", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                {Array.isArray(item.themes) && item.themes.length > 0 && (
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "2px" }}>
                                                        {item.themes.map((t, idx) => (
                                                            <span key={idx} className="badge" style={{ backgroundColor: "rgba(109, 93, 252, 0.12)", color: "#6d5dfc", border: "1px solid rgba(109, 93, 252, 0.2)", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                                <Tag size={11} />
                                                                <span>{t}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p>
                                                    <strong>AI Status:</strong>{" "}
                                                    <span className={`badge ${
                                                        item.aiStatus === "COMPLETED" ? "badge-pos" :
                                                        item.aiStatus === "FAILED" ? "badge-neg" : "badge-neu"
                                                    }`} style={{ padding: "2px 6px", fontSize: "0.75rem" }}>
                                                        {item.aiStatus || "PENDING"}
                                                    </span>
                                                </p>

                                                <p>
                                                    <strong>Sentiment:</strong>{" "}
                                                    {item.sentiment}
                                                </p>

                                                <p>
                                                    <strong>Score:</strong>{" "}
                                                    {item.sentimentScore}
                                                </p>

                                                <p>
                                                    <strong>Feature:</strong>{" "}
                                                    {item.featureArea || "Not classified"}
                                                </p>

                                                {item.rationale && (
                                                    <p>
                                                        <strong>Why:</strong>{" "}
                                                        {item.rationale}
                                                    </p>
                                                )}

                                                {canEdit && item.aiStatus === "FAILED" && (
                                                    <button
                                                        className="btn-secondary"
                                                        style={{ padding: "3px 8px", fontSize: "0.75rem", marginTop: "4px", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                                        onClick={async () => {
                                                            try {
                                                                await api.post(`/ai/feedback/${item._id}/retry`);
                                                                fetchFeedbacks();
                                                            } catch (retryErr) {
                                                                alert(retryErr.response?.data?.message || "Retry failed");
                                                            }
                                                        }}
                                                    >
                                                        <RotateCcw size={12} />
                                                        <span>Retry AI</span>
                                                    </button>
                                                )}

                                                {canEdit && (!item.rationale && item.aiStatus !== "FAILED") && (
                                                    <button
                                                        className="btn-secondary"
                                                        style={{ padding: "3px 8px", fontSize: "0.75rem", marginTop: "4px", alignSelf: "flex-start" }}
                                                        disabled={analyzingId === item._id}
                                                        onClick={() => analyzeFeedback(item._id)}
                                                    >
                                                        {analyzingId === item._id ? "Analyzing..." : "Analyze with AI"}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-channel">
                                                {item.channel}
                                            </span>
                                        </td>
                                        <td>{item.customerLabel || "—"}</td>
                                        <td>
                                            <span className={`badge ${item.sentiment === "POS" ? "badge-pos" :
                                                item.sentiment === "NEG" ? "badge-neg" : "badge-neu"
                                                }`}>
                                                {item.sentiment === "POS" ? <Smile size={13} /> :
                                                    item.sentiment === "NEG" ? <Frown size={13} /> : <Meh size={13} />}
                                                <span>{item.sentiment === "POS" ? "POS" :
                                                    item.sentiment === "NEG" ? "NEG" : "NEU"}</span>
                                            </span>
                                        </td>
                                        <td>
                                            {canEdit ? (
                                                <select
                                                    className="filter-select"
                                                    style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                                >
                                                    <option value="NEW">NEW</option>
                                                    <option value="REVIEWED">REVIEWED</option>
                                                    <option value="ACTIONED">ACTIONED</option>
                                                </select>
                                            ) : (
                                                <span className="badge badge-neu">{item.status}</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => setDeleteId(item._id)}
                                                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Delete</span>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderTop: "1px solid var(--border-light)" }}>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                className="btn-secondary"
                                disabled={page === 1}
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                                <ChevronLeft size={16} />
                                <span>Previous</span>
                            </button>
                            <button
                                className="btn-secondary"
                                disabled={page === totalPages}
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                                <span>Next</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteId && isAdmin && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Confirm Delete</h3>
                            <button className="btn-secondary" style={{ padding: "4px 8px" }} onClick={() => setDeleteId(null)}>
                                <X size={16} />
                            </button>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                            Are you sure you want to permanently delete this feedback record? This action cannot be undone.
                        </p>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setDeleteId(null)}>
                                Cancel
                            </button>
                            <button className="btn-danger" style={{ padding: "10px 18px" }} onClick={confirmDelete}>
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feedback;