import React, { useState } from "react";
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
    CheckCircle2
} from "lucide-react";

function Reports() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function generateReport() {
        try {
            setLoading(true);
            setError("");
            setReport(null);

            if (!from || !to) {
                setError("Please select both 'From' and 'To' dates.");
                return;
            }

            const response = await api.get("/reports", {
                params: { from, to }
            });

            setReport(response.data);
        } catch (err) {
            console.error("Generate report error:", err);
            setError(err.response?.data?.message || "Failed to generate report");
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
                        <span>Executive Reports & Intelligence</span>
                    </h1>
                    <p className="page-subtitle">
                        Analyze customer sentiment, top feature themes, and AI recommendations over a custom date range.
                    </p>
                </div>
            </div>

            {/* Date Filters Card */}
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
                    onClick={generateReport}
                    disabled={loading}
                    style={{ height: "42px", padding: "0 24px" }}
                >
                    {loading ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                            <span>Generating...</span>
                        </span>
                    ) : (
                        "Generate Report"
                    )}
                </button>
            </div>

            {error && (
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Report Content */}
            {report && (
                <div className="report-content">
                    {/* Header Action Bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                            Report Summary ({new Date(report.dateRange.from).toLocaleDateString()} – {new Date(report.dateRange.to).toLocaleDateString()})
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

                    {/* Summary KPI Grid */}
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

                    {/* Sentiment Section */}
                    <div className="report-section">
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                            Sentiment Breakdown Ratio
                        </h2>

                        <div className="sentiment-report">
                            <div style={{ borderLeft: "4px solid #22c55e" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a", fontSize: "0.85rem", fontWeight: 600 }}>
                                    <Smile size={16} />
                                    <span>Positive Ratio</span>
                                </div>
                                <strong style={{ color: "#16a34a" }}>
                                    {report.sentimentPercentage.positive.toFixed(1)}%
                                </strong>
                            </div>

                            <div style={{ borderLeft: "4px solid #94a3b8" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                                    <Meh size={16} />
                                    <span>Neutral Ratio</span>
                                </div>
                                <strong style={{ color: "#64748b" }}>
                                    {report.sentimentPercentage.neutral.toFixed(1)}%
                                </strong>
                            </div>

                            <div style={{ borderLeft: "4px solid #ef4444" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626", fontSize: "0.85rem", fontWeight: 600 }}>
                                    <Frown size={16} />
                                    <span>Negative Ratio</span>
                                </div>
                                <strong style={{ color: "#dc2626" }}>
                                    {report.sentimentPercentage.negative.toFixed(1)}%
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Top Themes */}
                    <div className="report-section">
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Layers size={18} color="var(--primary)" />
                            <span>Top Feature Themes</span>
                        </h2>

                        {report.themes.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                No classified feature themes recorded in this period.
                            </p>
                        ) : (
                            <div className="report-theme-list">
                                {report.themes.map((theme) => (
                                    <div key={theme._id} className="report-theme">
                                        <div>
                                            <strong style={{ fontSize: "1rem" }}>{theme._id}</strong>
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
                        )}
                    </div>

                    {/* AI Insights Section */}
                    <div className="report-section">
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Sparkles size={18} color="var(--primary)" />
                            <span>AI Insights & Recommendations</span>
                        </h2>

                        {report.insights.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                No AI insights generated for this date range.
                            </p>
                        ) : (
                            report.insights.map((insight) => (
                                <div key={insight._id} className="report-insight">
                                    <div>
                                        <span className="badge badge-channel">{insight.theme}</span>
                                        <strong className={`badge ${
                                            insight.priority === "HIGH" ? "badge-neg" :
                                            insight.priority === "MEDIUM" ? "badge-neu" : "badge-pos"
                                        }`}>
                                            {insight.priority} PRIORITY
                                        </strong>
                                    </div>

                                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "8px 0" }}>
                                        {insight.title}
                                    </h3>

                                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 10px 0" }}>
                                        {insight.summary}
                                    </p>

                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>
                                        <CheckCircle2 size={15} />
                                        <span>Action: {insight.recommendation}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;
