import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
    FileText,
    Calendar,
    Download,
    Printer,
    AlertCircle,
    Loader2,
    Smile,
    Meh,
    Frown,
    Layers,
    Sparkles,
    CheckCircle2,
    Quote,
    FolderArchive,
    Eye
} from "lucide-react";

function Reports() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [report, setReport] = useState(null);
    const [savedReports, setSavedReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedLoading, setSavedLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadSavedReports() {
        try {
            setSavedLoading(true);
            const res = await api.get("/reports/saved");
            setSavedReports(res.data.reports || []);
        } catch (err) {
            console.error("Load saved reports error:", err);
        } finally {
            setSavedLoading(false);
        }
    }

    useEffect(() => {
        loadSavedReports();
    }, []);

    async function generateVoCReport() {
        try {
            setLoading(true);
            setError("");
            setReport(null);

            if (!from || !to) {
                setError("Please select both 'From' and 'To' dates.");
                return;
            }

            const response = await api.post("/reports/voc", {
                from,
                to,
                title: `Weekly Voice-of-Customer Report (${from} to ${to})`
            });

            setReport(response.data.report?.contentJson || response.data.report);
            loadSavedReports();
        } catch (err) {
            console.error("Generate VoC report error:", err);
            setError(err.response?.data?.message || "Failed to generate VoC report");
        } finally {
            setLoading(false);
        }
    }

    async function downloadFile(type) {
        try {
            if (!from || !to) {
                setError("Please select both dates.");
                return;
            }

            const response = await api.get(`/reports/export/${type}`, {
                params: { from, to },
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: type === "csv" ? "text/csv" : "application/pdf"
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = type === "csv"
                ? `loop-feedback-${from}-to-${to}.csv`
                : `loop-report-${from}-to-${to}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(`Failed to download ${type.toUpperCase()} file.`);
        }
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText size={26} color="var(--primary)" />
                        <span>Executive Voice-of-Customer (VoC) Reports</span>
                    </h1>
                    <p className="page-subtitle">
                        Generate period-based AI executive summaries, top customer themes, sentiment shifts, and saved PDF reports.
                    </p>
                </div>
            </div>

            {/* Date Filters & VoC Generator Card */}
            <div className="report-filters">
                <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} color="var(--primary)" />
                        <span>From Date</span>
                    </label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} color="var(--primary)" />
                        <span>To Date</span>
                    </label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>

                <button
                    className="btn-primary"
                    onClick={generateVoCReport}
                    disabled={loading}
                    style={{ height: "42px", padding: "0 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                            <span>Generating VoC Report...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Generate AI VoC Report</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Active Generated Report Display */}
            {report && (
                <div className="report-content" style={{ marginTop: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <Sparkles color="var(--primary)" size={22} />
                            <span>Executive VoC Narrative Report ({from} – {to})</span>
                        </h2>

                        <div className="report-actions" style={{ marginBottom: 0 }}>
                            <button
                                className="btn-secondary"
                                onClick={() => downloadFile("csv")}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Download size={15} />
                                <span>Export CSV</span>
                            </button>

                            <button
                                className="btn-primary"
                                onClick={() => downloadFile("pdf")}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Printer size={15} />
                                <span>Export PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Executive Summary Card */}
                    {report.narrative && (
                        <div style={{
                            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
                            border: "1px solid rgba(99, 102, 241, 0.25)",
                            borderRadius: "16px",
                            padding: "24px",
                            marginBottom: "24px"
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)", marginBottom: "10px" }}>
                                📝 Executive Summary
                            </h3>
                            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-main)", marginBottom: "16px" }}>
                                {report.narrative.executiveSummary}
                            </p>

                            {report.narrative.keyFindings && (
                                <div style={{ marginBottom: "16px" }}>
                                    <strong style={{ fontSize: "0.95rem", display: "block", marginBottom: "6px" }}>Key Findings:</strong>
                                    <ul style={{ paddingLeft: "20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                        {report.narrative.keyFindings.map((f, i) => (
                                            <li key={i} style={{ marginBottom: "4px" }}>{f}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {report.narrative.recommendations && (
                                <div>
                                    <strong style={{ fontSize: "0.95rem", color: "#16a34a", display: "block", marginBottom: "6px" }}>Recommended Action Items:</strong>
                                    <ul style={{ paddingLeft: "20px", color: "var(--text-main)", fontSize: "0.9rem" }}>
                                        {report.narrative.recommendations.map((r, i) => (
                                            <li key={i} style={{ marginBottom: "4px", fontWeight: 600 }}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Summary KPI Grid */}
                    {report.summary && (
                        <div className="report-kpi-grid">
                            <div className="report-kpi">
                                <span>Total Feedback</span>
                                <strong>{report.summary.totalFeedback}</strong>
                            </div>

                            <div className="report-kpi" style={{ borderLeft: "4px solid #22c55e" }}>
                                <span>Positive</span>
                                <strong style={{ color: "#16a34a" }}>{report.summary.positive}</strong>
                            </div>

                            <div className="report-kpi" style={{ borderLeft: "4px solid #94a3b8" }}>
                                <span>Neutral</span>
                                <strong style={{ color: "#64748b" }}>{report.summary.neutral}</strong>
                            </div>

                            <div className="report-kpi" style={{ borderLeft: "4px solid #ef4444" }}>
                                <span>Negative</span>
                                <strong style={{ color: "#dc2626" }}>{report.summary.negative}</strong>
                            </div>
                        </div>
                    )}

                    {/* Top Themes */}
                    {report.topThemes && report.topThemes.length > 0 && (
                        <div className="report-section">
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Layers size={18} color="var(--primary)" />
                                <span>Top Feature Themes</span>
                            </h2>
                            <div className="report-theme-list">
                                {report.topThemes.map((theme, idx) => (
                                    <div key={idx} className="report-theme">
                                        <div>
                                            <strong style={{ fontSize: "1rem" }}>{theme.name}</strong>
                                            <span>{theme.count} feedback items</span>
                                        </div>

                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            backgroundColor: theme.negative > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                                            color: theme.negative > 0 ? "#dc2626" : "#16a34a",
                                            fontWeight: 700,
                                            fontSize: "0.85rem"
                                        }}>
                                            {theme.negative} negative
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Saved Reports Browser */}
            <div className="table-card" style={{ marginTop: "32px", padding: "24px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FolderArchive size={20} color="var(--primary)" />
                    <span>Saved Historical VoC Reports ({savedReports.length})</span>
                </h3>

                {savedLoading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                        <span>Loading saved reports...</span>
                    </div>
                ) : savedReports.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        No saved VoC reports found. Select a date range above and click "Generate AI VoC Report".
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {savedReports.map((saved) => (
                            <div
                                key={saved._id}
                                style={{
                                    padding: "16px 20px",
                                    border: "1px solid var(--border-light)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    justify: "space-between",
                                    alignItems: "center",
                                    backgroundColor: "var(--bg-subtle, rgba(255,255,255,0.02))"
                                }}
                            >
                                <div>
                                    <strong style={{ fontSize: "1rem", display: "block" }}>{saved.title}</strong>
                                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                        Generated by {saved.generatedBy?.name || "Admin"} on {new Date(saved.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setReport(saved.contentJson);
                                        if (saved.periodStart && saved.periodEnd) {
                                            setFrom(new Date(saved.periodStart).toISOString().split("T")[0]);
                                            setTo(new Date(saved.periodEnd).toISOString().split("T")[0]);
                                        }
                                    }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                >
                                    <Eye size={15} />
                                    <span>View Report</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reports;
