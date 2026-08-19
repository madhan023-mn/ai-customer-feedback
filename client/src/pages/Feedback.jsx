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
    Sparkles,
    RotateCcw,
    Layers,
    Tag,
    CheckCircle2,
    Clock,
    Inbox,
    RefreshCw
} from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";

function Feedback() {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // AI Status summary counts
    const [aiSummary, setAiSummary] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
        processing: 0
    });

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
            
            let updatedFeedback = null;
            try {
                const res = await api.post(`/feedback/${id}/analyze`);
                updatedFeedback = res.data.feedback;
            } catch (p1Err) {
                const res = await api.post(`/ai/feedback/${id}/analyze`);
                updatedFeedback = res.data.feedback;
            }

            if (updatedFeedback) {
                setFeedbacks(prev => prev.map(f => f._id === id ? updatedFeedback : f));
                // Update summary counters
                setAiSummary(prev => ({
                    ...prev,
                    pending: Math.max(0, prev.pending - 1),
                    completed: prev.completed + 1
                }));
            } else {
                fetchFeedbacks();
            }
        } catch (err) {
            console.error("Individual analyze error:", err);
            setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, aiStatus: "FAILED" } : f));
            alert(err.response?.data?.message || "Failed to analyze feedback item");
        } finally {
            setAnalyzingId(null);
        }
    }

    async function analyzeAllPending() {
        if (!canEdit || batchLoading) return;
        try {
            setBatchLoading(true);
            setBatchMessage("");

            let response;
            try {
                response = await api.post("/feedback/analyze-all");
            } catch (p1Err) {
                response = await api.post("/ai/feedback/analyze-pending");
            }

            const { processed = 0, successful = 0, failed = 0, message } = response.data || {};
            setBatchMessage(
                message || `Processed ${processed} feedback. ${successful} successful, ${failed} failed.`
            );

            await fetchFeedbacks();
        } catch (err) {
            console.error("Analyze all error:", err);
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
            const list = res.data.feedbacks || res.data.feedback || [];
            setFeedbacks(list);
            setTotalPages(res.data.pages || res.data.pagination?.totalPages || 1);
            setTotalItems(res.data.total || res.data.pagination?.total || 0);

            if (res.data.aiSummary) {
                setAiSummary(res.data.aiSummary);
            } else {
                // Fetch stats fallback
                const statsRes = await api.get("/feedback/stats");
                if (statsRes.data?.aiStatus) {
                    setAiSummary(statsRes.data.aiStatus);
                }
            }
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
            setTotalItems(prev => Math.max(0, prev - 1));
            setAiSummary(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            setDeleteId(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete feedback");
        }
    }

    return (
        <div className="main-content">
            {/* Header */}
            <div className="page-header" style={{ marginBottom: "1.5rem" }}>
                <div>
                    <h1 className="page-title">Feedback Hub</h1>
                    <p className="page-subtitle">
                        Central intelligence hub for customer feedback analysis, sentiment classification, and triage.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {canEdit && (
                        <>
                            <button
                                className="btn-primary"
                                onClick={analyzeAllPending}
                                disabled={batchLoading || aiSummary.pending === 0}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 18px",
                                    fontSize: "0.92rem",
                                    fontWeight: 700,
                                    background: aiSummary.pending > 0 
                                        ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" 
                                        : "#e2e8f0",
                                    color: aiSummary.pending > 0 ? "#ffffff" : "#64748b",
                                    border: "none",
                                    borderRadius: "10px",
                                    boxShadow: aiSummary.pending > 0 ? "0 4px 14px rgba(99, 102, 241, 0.35)" : "none",
                                    cursor: aiSummary.pending > 0 && !batchLoading ? "pointer" : "not-allowed",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {batchLoading ? (
                                    <>
                                        <RefreshCw size={17} style={{ animation: "spin 1s linear infinite" }} />
                                        <span>Analyzing All with AI...</span>
                                    </>
                                ) : aiSummary.pending > 0 ? (
                                    <>
                                        <Sparkles size={17} />
                                        <span>Analyze All with AI ({aiSummary.pending} Pending)</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={17} color="#16a34a" />
                                        <span>All Feedback Analyzed</span>
                                    </>
                                )}
                            </button>

                            <Link
                                to="/feedback/add"
                                className="btn-secondary"
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 16px" }}
                            >
                                <PlusCircle size={16} />
                                <span>Add / Import</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* AI Status & Feedback Metrics Banner */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "14px",
                    marginBottom: "1.5rem"
                }}
            >
                {/* Total Feedback Counter */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Inbox size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Total Feedback
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.15 }}>
                            {aiSummary.total || totalItems}
                        </div>
                    </div>
                </div>

                {/* Pending AI Counter */}
                <div
                    style={{
                        background: aiSummary.pending > 0 ? "rgba(245, 158, 11, 0.04)" : "#ffffff",
                        border: aiSummary.pending > 0 ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(245, 158, 11, 0.12)",
                            color: "#d97706",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Clock size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "#b45309", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            AI Status: Pending
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#d97706", lineHeight: 1.15 }}>
                            {aiSummary.pending}
                        </div>
                    </div>
                </div>

                {/* Completed AI Counter */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid var(--border-light)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "#16a34a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            AI Completed
                        </span>
                        <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#16a34a", lineHeight: 1.15 }}>
                            {aiSummary.completed}
                        </div>
                    </div>
                </div>

                {/* Failed Counter (if any) */}
                {aiSummary.failed > 0 && (
                    <div
                        style={{
                            background: "rgba(239, 68, 68, 0.04)",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                            borderRadius: "14px",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px"
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                background: "rgba(239, 68, 68, 0.12)",
                                color: "#dc2626",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <AlertCircle size={22} />
                        </div>
                        <div>
                            <span style={{ fontSize: "0.8rem", color: "#b91c1c", fontWeight: 600, textTransform: "uppercase" }}>
                                AI Failed
                            </span>
                            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#dc2626", lineHeight: 1.15 }}>
                                {aiSummary.failed}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Batch Action Alert Banner */}
            {batchMessage && (
                <div
                    className="alert-success"
                    style={{
                        marginBottom: "1.25rem",
                        padding: "12px 16px",
                        backgroundColor: "rgba(99, 102, 241, 0.08)",
                        color: "#4338ca",
                        borderRadius: "10px",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                        fontSize: "0.92rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Sparkles size={18} color="#6366f1" />
                        <span>{batchMessage}</span>
                    </div>
                    <button
                        onClick={() => setBatchMessage("")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", padding: "2px" }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {error && (
                <div className="alert-error" style={{ marginBottom: "1rem" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Saved Views / Segment Presets */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Quick Presets:</span>
                <button
                    type="button"
                    className="badge"
                    style={{
                        cursor: "pointer",
                        background: sentiment === "ALL" && featureArea === "ALL" && status === "ALL" && aiStatusFilter === "ALL" ? "var(--primary)" : "white",
                        color: sentiment === "ALL" && featureArea === "ALL" && status === "ALL" && aiStatusFilter === "ALL" ? "white" : "var(--text-main)",
                        border: "1px solid var(--border-light)",
                        padding: "5px 12px",
                        fontSize: "0.78rem"
                    }}
                    onClick={() => { setSentiment("ALL"); setFeatureArea("ALL"); setStatus("ALL"); setChannel("ALL"); setAiStatusFilter("ALL"); setPage(1); }}
                >
                    All Feedback
                </button>
                <button
                    type="button"
                    className="badge"
                    style={{
                        cursor: "pointer",
                        background: aiStatusFilter === "PENDING" ? "#f59e0b" : "#fffbeb",
                        color: aiStatusFilter === "PENDING" ? "white" : "#b45309",
                        border: "1px solid #fde68a",
                        padding: "5px 12px",
                        fontSize: "0.78rem"
                    }}
                    onClick={() => { setAiStatusFilter("PENDING"); setSentiment("ALL"); setFeatureArea("ALL"); setPage(1); }}
                >
                    <Clock size={13} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                    <span>Pending Analysis ({aiSummary.pending})</span>
                </button>
                <button
                    type="button"
                    className="badge"
                    style={{
                        cursor: "pointer",
                        background: sentiment === "POS" ? "#10b981" : "#f0fdf4",
                        color: sentiment === "POS" ? "white" : "#15803d",
                        border: "1px solid #bbf7d0",
                        padding: "5px 12px",
                        fontSize: "0.78rem"
                    }}
                    onClick={() => { setSentiment("POS"); setFeatureArea("ALL"); setStatus("ALL"); setAiStatusFilter("ALL"); setPage(1); }}
                >
                    Positive Praise
                </button>
                <button
                    type="button"
                    className="badge"
                    style={{
                        cursor: "pointer",
                        background: sentiment === "NEG" ? "#ef4444" : "#fff1f2",
                        color: sentiment === "NEG" ? "white" : "#be123c",
                        border: "1px solid #fecdd3",
                        padding: "5px 12px",
                        fontSize: "0.78rem"
                    }}
                    onClick={() => { setSentiment("NEG"); setFeatureArea("ALL"); setStatus("ALL"); setAiStatusFilter("ALL"); setPage(1); }}
                >
                    Negative Issues
                </button>
                <button
                    type="button"
                    className="badge"
                    style={{
                        cursor: "pointer",
                        background: featureArea === "Authentication" ? "var(--primary)" : "white",
                        color: featureArea === "Authentication" ? "white" : "var(--text-main)",
                        border: "1px solid var(--border-light)",
                        padding: "5px 12px",
                        fontSize: "0.78rem"
                    }}
                    onClick={() => { setFeatureArea("Authentication"); setSentiment("ALL"); setStatus("ALL"); setAiStatusFilter("ALL"); setPage(1); }}
                >
                    Login / Auth
                </button>
                <button
                    type="button"
                    className="badge"
                    style={{
                        cursor: "pointer",
                        background: featureArea === "Payments" ? "var(--primary)" : "white",
                        color: featureArea === "Payments" ? "white" : "var(--text-main)",
                        border: "1px solid var(--border-light)",
                        padding: "5px 12px",
                        fontSize: "0.78rem"
                    }}
                    onClick={() => { setFeatureArea("Payments"); setSentiment("ALL"); setStatus("ALL"); setAiStatusFilter("ALL"); setPage(1); }}
                >
                    Payments
                </button>
            </div>

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
                        value={aiStatusFilter}
                        onChange={(e) => { setAiStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All AI Statuses</option>
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="FAILED">FAILED</option>
                    </select>

                    <select
                        className="filter-select"
                        value={featureArea}
                        onChange={(e) => { setFeatureArea(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Features</option>
                        <option value="Authentication">Authentication</option>
                        <option value="Payments">Payments</option>
                        <option value="Checkout">Checkout</option>
                        <option value="Support">Support</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Search">Search</option>
                        <option value="Onboarding">Onboarding</option>
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
                        <option value="POS">Positive (POS)</option>
                        <option value="NEU">Neutral (NEU)</option>
                        <option value="NEG">Negative (NEG)</option>
                    </select>

                    <select
                        className="filter-select"
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Workflow Status</option>
                        <option value="NEW">NEW</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ACTIONED">ACTIONED</option>
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

            {/* Table Card */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: "36%" }}>Feedback & AI Insights</th>
                                <th style={{ width: "15%" }}>Channel & Customer</th>
                                <th style={{ width: "11%" }}>Sentiment</th>
                                <th style={{ width: "15%" }}>AI Status & Action</th>
                                <th style={{ width: "12%" }}>Workflow Status</th>
                                {isAdmin && <th style={{ width: "11%", textAlign: "center" }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} style={{ padding: "3.5rem 1rem", textAlign: "center" }}>
                                        <LoadingScreen
                                            title="Loading Feedback Hub..."
                                            subtitle="Fetching customer records, sentiment classifications, and AI tags"
                                            minHeight="200px"
                                        />
                                    </td>
                                </tr>
                            ) : feedbacks.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="empty-state">
                                        No feedback matching your filters. {canEdit && <Link to="/feedback/add">Add new feedback</Link>}.
                                    </td>
                                </tr>
                            ) : (
                                feedbacks.map((item) => {
                                    const isRowAnalyzing = analyzingId === item._id || item.aiStatus === "PROCESSING";
                                    return (
                                        <tr key={item._id}>
                                            {/* Column 1: Feedback & AI Insights */}
                                            <td>
                                                <div className="feedback-content-text" style={{ fontSize: "0.92rem", fontWeight: 500, color: "var(--text-main)", lineHeight: 1.45 }}>
                                                    {item.content}
                                                </div>

                                                <div style={{ marginTop: "6px", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    {/* Themes Pill Tags */}
                                                    {Array.isArray(item.themes) && item.themes.length > 0 && (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                            {item.themes.map((t, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="badge"
                                                                    style={{
                                                                        backgroundColor: "rgba(109, 93, 252, 0.08)",
                                                                        color: "#6d5dfc",
                                                                        border: "1px solid rgba(109, 93, 252, 0.2)",
                                                                        fontSize: "0.72rem",
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        gap: "3px",
                                                                        padding: "1px 7px"
                                                                    }}
                                                                >
                                                                    <Tag size={10} />
                                                                    <span>{typeof t === "object" ? t.name : t}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                                        <span>
                                                            <strong>Feature:</strong> {item.featureArea || "Not classified"}
                                                        </span>
                                                        <span>
                                                            <strong>Score:</strong> {item.sentimentScore ?? 0}
                                                        </span>
                                                    </div>

                                                    {item.rationale && (
                                                        <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.35 }}>
                                                            <strong>Why:</strong> {item.rationale}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 2: Channel & Customer */}
                                            <td>
                                                <span className="badge badge-channel" style={{ fontSize: "0.75rem", padding: "2px 7px" }}>
                                                    {item.channel}
                                                </span>
                                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px", fontWeight: 500 }}>
                                                    {item.customerLabel || "—"}
                                                </div>
                                            </td>

                                            {/* Column 3: Sentiment */}
                                            <td>
                                                <span className={`badge ${
                                                    item.sentiment === "POS" ? "badge-pos" :
                                                    item.sentiment === "NEG" ? "badge-neg" : "badge-neu"
                                                }`} style={{ fontSize: "0.75rem", padding: "3px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                    {item.sentiment === "POS" ? <Smile size={12} /> :
                                                     item.sentiment === "NEG" ? <Frown size={12} /> : <Meh size={12} />}
                                                    <span>{item.sentiment === "POS" ? "POS" :
                                                           item.sentiment === "NEG" ? "NEG" : "NEU"}</span>
                                                </span>
                                            </td>

                                            {/* Column 4: AI Status & Individual Action */}
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                                                    <span
                                                        className={`badge ${
                                                            item.aiStatus === "COMPLETED" ? "badge-pos" :
                                                            item.aiStatus === "FAILED" ? "badge-neg" : "badge-neu"
                                                        }`}
                                                        style={{
                                                            padding: "2px 8px",
                                                            fontSize: "0.72rem",
                                                            fontWeight: 700,
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                            background: item.aiStatus === "COMPLETED" ? "#ecfdf5" :
                                                                        item.aiStatus === "FAILED" ? "#fff1f2" :
                                                                        item.aiStatus === "PROCESSING" ? "#eef2ff" : "#fffbeb",
                                                            color: item.aiStatus === "COMPLETED" ? "#15803d" :
                                                                   item.aiStatus === "FAILED" ? "#be123c" :
                                                                   item.aiStatus === "PROCESSING" ? "#4338ca" : "#b45309",
                                                            border: item.aiStatus === "COMPLETED" ? "1px solid #a7f3d0" :
                                                                    item.aiStatus === "FAILED" ? "1px solid #fecdd3" :
                                                                    item.aiStatus === "PROCESSING" ? "1px solid #c7d2fe" : "1px solid #fde68a"
                                                        }}
                                                    >
                                                        {item.aiStatus === "COMPLETED" && <CheckCircle2 size={11} color="#16a34a" />}
                                                        {item.aiStatus === "PENDING" && <Clock size={11} color="#d97706" />}
                                                        {item.aiStatus === "PROCESSING" && <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} color="#4f46e5" />}
                                                        {item.aiStatus === "FAILED" && <AlertCircle size={11} color="#dc2626" />}
                                                        <span>{item.aiStatus || "PENDING"}</span>
                                                    </span>

                                                    {canEdit && (
                                                        item.aiStatus === "PENDING" ? (
                                                            <button
                                                                className="btn-primary"
                                                                style={{
                                                                    padding: "3px 9px",
                                                                    fontSize: "0.72rem",
                                                                    fontWeight: 600,
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    borderRadius: "6px",
                                                                    whiteSpace: "nowrap"
                                                                }}
                                                                disabled={isRowAnalyzing}
                                                                onClick={() => analyzeFeedback(item._id)}
                                                            >
                                                                {isRowAnalyzing ? (
                                                                    <>
                                                                        <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
                                                                        <span>Analyzing...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Sparkles size={10} />
                                                                        <span>Analyze</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : item.aiStatus === "COMPLETED" ? (
                                                            <button
                                                                className="btn-secondary"
                                                                style={{
                                                                    padding: "2px 8px",
                                                                    fontSize: "0.72rem",
                                                                    fontWeight: 500,
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "3px",
                                                                    borderRadius: "5px",
                                                                    whiteSpace: "nowrap",
                                                                    color: "var(--text-muted)"
                                                                }}
                                                                disabled={isRowAnalyzing}
                                                                onClick={() => analyzeFeedback(item._id)}
                                                                title="Re-run AI sentiment and feature extraction"
                                                            >
                                                                {isRowAnalyzing ? (
                                                                    <>
                                                                        <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
                                                                        <span>Updating...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <RotateCcw size={10} />
                                                                        <span>Re-analyze</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : item.aiStatus === "FAILED" ? (
                                                            <button
                                                                className="btn-secondary"
                                                                style={{
                                                                    padding: "2px 8px",
                                                                    fontSize: "0.72rem",
                                                                    fontWeight: 600,
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "3px",
                                                                    borderRadius: "5px",
                                                                    color: "#dc2626",
                                                                    borderColor: "#fca5a5",
                                                                    background: "#fef2f2",
                                                                    whiteSpace: "nowrap"
                                                                }}
                                                                disabled={isRowAnalyzing}
                                                                onClick={() => analyzeFeedback(item._id)}
                                                            >
                                                                {isRowAnalyzing ? (
                                                                    <>
                                                                        <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
                                                                        <span>Retrying...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <RotateCcw size={10} />
                                                                        <span>Retry AI</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : null
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 5: Workflow Status */}
                                            <td>
                                                {canEdit ? (
                                                    <select
                                                        className="filter-select"
                                                        style={{ padding: "4px 8px", fontSize: "0.78rem", width: "100%", maxWidth: "120px" }}
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                                    >
                                                        <option value="NEW">NEW</option>
                                                        <option value="REVIEWED">REVIEWED</option>
                                                        <option value="ACTIONED">ACTIONED</option>
                                                    </select>
                                                ) : (
                                                    <span className="badge badge-neu" style={{ fontSize: "0.75rem" }}>{item.status}</span>
                                                )}
                                            </td>

                                            {/* Column 6: Actions */}
                                            {isAdmin && (
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => setDeleteId(item._id)}
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 9px", fontSize: "0.74rem", borderRadius: "6px" }}
                                                    >
                                                        <Trash2 size={11} />
                                                        <span>Delete</span>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderTop: "1px solid var(--border-light)" }}>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            Page {page} of {totalPages} ({totalItems} total records)
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

            {/* Delete Confirmation Modal */}
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