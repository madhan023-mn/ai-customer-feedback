import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
    FileSpreadsheet,
    UploadCloud,
    AlertCircle,
    CheckCircle2,
    FileText,
    RefreshCw,
    Radio,
    Sparkles,
    Headphones,
    Smartphone,
    PhoneCall,
    BarChart2,
    Users,
    Download,
    ArrowRight,
    XCircle
} from "lucide-react";

function ImportFeedback() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("csv"); // "csv" or "simulated"

    // CSV File & Validation Result States
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // Simulated Channel State
    const [selectedChannel, setSelectedChannel] = useState("SUPPORT_TICKET");
    const [simulating, setSimulating] = useState(false);
    const [simulatedMsg, setSimulatedMsg] = useState("");

    function handleFileChange(event) {
        const selectedFile = event.target.files?.[0];
        setError("");
        setResult(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
            setError("Please select a CSV file.");
            setFile(null);
            return;
        }

        setFile(selectedFile);
    }

    async function handleUpload() {
        if (!file) {
            setError("Please choose a CSV file.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const formData = new FormData();
            formData.append("file", file);

            let response;
            try {
                response = await api.post("/import/feedback", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            } catch (p1Err) {
                try {
                    response = await api.post("/feedback/import", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
                } catch (p2Err) {
                    response = await api.post("/feedback/upload", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
                }
            }

            setResult(response.data);
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || "Import failed");
        } finally {
            setLoading(false);
        }
    }

    async function handleSimulatePull() {
        setError("");
        setSimulatedMsg("");
        setSimulating(true);

        try {
            const res = await api.post("/feedback/simulate", { channel: selectedChannel });
            setSimulatedMsg(res.data.message || `Successfully ingested ${res.data.count} simulated items from ${selectedChannel}!`);
            setTimeout(() => navigate("/feedback"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to simulate channel ingestion");
        } finally {
            setSimulating(false);
        }
    }

    function downloadErrorLog() {
        if (!result || !result.rejectedRows || !result.rejectedRows.length) return;

        const csvContent = [
            ["Row Number", "Errors", "Raw Content", "Raw Channel"].join(","),
            ...result.rejectedRows.map(r => [
                r.rowNumber,
                `"${(r.errors || []).join("; ")}"`,
                `"${(r.data?.content || "").replace(/"/g, '""')}"`,
                `"${r.data?.channel || ""}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `import_errors_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const channelCards = [
        { id: "SUPPORT_TICKET", label: "Zendesk Support Tickets", icon: Headphones, desc: "Simulate incoming support ticket streams with billing & setup issues" },
        { id: "APP_STORE", label: "App Store & Play Store", icon: Smartphone, desc: "Simulate mobile app ratings, reviews, and crash reports" },
        { id: "SALES_CALL", label: "Sales Call Notes", icon: PhoneCall, desc: "Simulate CRM sales call notes, feature blockers, and enterprise requests" },
        { id: "NPS_SURVEY", label: "NPS & CSAT Surveys", icon: BarChart2, desc: "Simulate quarterly NPS free-text feedback and satisfaction ratings" },
        { id: "COMMUNITY", label: "Community Forum Posts", icon: Users, desc: "Simulate public community feature requests and discussion threads" }
    ];

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Import & Integration Hub</h1>
                    <p className="page-subtitle">Robust CSV feedback ingestion with header & row validation pipeline</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-header" style={{ marginBottom: "2rem" }}>
                <button
                    className={`tab-btn ${activeTab === "csv" ? "active" : ""}`}
                    onClick={() => { setActiveTab("csv"); setError(""); setResult(null); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <FileSpreadsheet size={16} />
                    <span>Robust CSV Upload</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === "simulated" ? "active" : ""}`}
                    onClick={() => { setActiveTab("simulated"); setError(""); setResult(null); setSimulatedMsg(""); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <Radio size={16} />
                    <span>Simulated Channel Integration</span>
                </button>
            </div>

            {error && (
                <div className="alert-error" style={{ maxWidth: "840px", margin: "0 auto 1.5rem auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {activeTab === "csv" ? (
                /* CSV Import Section */
                <div style={{ maxWidth: "840px", margin: "0 auto" }}>
                    {!result ? (
                        <div className="auth-card" style={{ maxWidth: "100%", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                                Import Feedback
                            </h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                                Upload customer feedback from a CSV file. Each row will be validated before insertion into your workspace.
                            </p>

                            {/* Dropzone Container */}
                            <label className="dropzone" style={{ display: "block", cursor: "pointer", padding: "2.5rem 1.5rem", border: "2px dashed var(--border-focus)", borderRadius: "var(--radius-md)", backgroundColor: "var(--primary-light)", textAlign: "center", transition: "all 0.2s ease" }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "var(--primary)" }}>
                                    <UploadCloud size={48} />
                                </div>
                                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-main)" }}>
                                    Drag & Drop CSV Here
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "8px 0" }}>
                                    or
                                </div>
                                <span className="btn-secondary" style={{ display: "inline-block", pointerEvents: "none", fontSize: "0.85rem", padding: "6px 16px" }}>
                                    Choose CSV File
                                </span>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </label>

                            {file && (
                                <div className="selected-file" style={{ marginTop: "1rem", padding: "10px 14px", background: "#f1f5f9", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                                    <FileText size={16} color="var(--primary)" />
                                    <span>Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                            )}

                            {/* Column Format Specification */}
                            <div className="csv-format" style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
                                <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-subtle)", marginBottom: "4px" }}>
                                    Required Columns
                                </h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600, marginBottom: "12px" }}>
                                    content, channel
                                </p>

                                <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-subtle)", marginBottom: "4px" }}>
                                    Optional Columns
                                </h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
                                    customerLabel, createdAt
                                </p>

                                <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "10px" }}>
                                    Supported Channels: <code>SURVEY</code>, <code>SUPPORT_TICKET</code>, <code>APP_REVIEW</code>, <code>EMAIL</code>, <code>SOCIAL</code>, <code>COMMUNITY</code>, <code>SALES_CALL</code>, <code>APP_STORE</code>
                                </div>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handleUpload}
                                disabled={loading || !file}
                                style={{ marginTop: "1.5rem", width: "100%", padding: "12px" }}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                                        <span>Validating & Importing CSV...</span>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud size={18} />
                                        <span>Import CSV</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        /* Import Result View */
                        <div className="import-result" style={{ background: "white", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-md)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                                <CheckCircle2 size={26} color="#16a34a" />
                                <div>
                                    <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
                                        Import Completed
                                    </h2>
                                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                        {result.message}
                                    </span>
                                </div>
                            </div>

                            {/* Stat Summary Grid */}
                            <div className="import-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "1.75rem" }}>
                                <div style={{ background: "#f8fafc", borderRadius: "var(--radius-md)", padding: "16px", border: "1px solid var(--border-light)" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Rows</span>
                                    <strong style={{ fontSize: "1.75rem", display: "block", color: "var(--text-main)", marginTop: "4px" }}>
                                        {result.summary?.totalRows ?? 0}
                                    </strong>
                                </div>

                                <div style={{ background: "#f0fdf4", borderRadius: "var(--radius-md)", padding: "16px", border: "1px solid #bbf7d0" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>Valid Rows</span>
                                    <strong style={{ fontSize: "1.75rem", display: "block", color: "#15803d", marginTop: "4px" }}>
                                        {result.summary?.validRows ?? 0}
                                    </strong>
                                </div>

                                <div style={{ background: result.summary?.rejectedRows > 0 ? "#fff1f2" : "#f8fafc", borderRadius: "var(--radius-md)", padding: "16px", border: result.summary?.rejectedRows > 0 ? "1px solid #fecdd3" : "1px solid var(--border-light)" }}>
                                    <span style={{ fontSize: "0.8rem", color: result.summary?.rejectedRows > 0 ? "#9f1239" : "var(--text-muted)", fontWeight: 600 }}>Rejected Rows</span>
                                    <strong style={{ fontSize: "1.75rem", display: "block", color: result.summary?.rejectedRows > 0 ? "#be123c" : "var(--text-main)", marginTop: "4px" }}>
                                        {result.summary?.rejectedRows ?? 0}
                                    </strong>
                                </div>

                                <div style={{ background: "#eef2ff", borderRadius: "var(--radius-md)", padding: "16px", border: "1px solid #c7d2fe" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#3730a3", fontWeight: 600 }}>Inserted Rows</span>
                                    <strong style={{ fontSize: "1.75rem", display: "block", color: "#4f46e5", marginTop: "4px" }}>
                                        {result.summary?.insertedRows ?? 0}
                                    </strong>
                                </div>
                            </div>

                            {/* Rejected Rows Details */}
                            {result.rejectedRows && result.rejectedRows.length > 0 && (
                                <div className="rejected-rows" style={{ marginTop: "2rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#be123c", display: "flex", alignItems: "center", gap: "6px" }}>
                                            <XCircle size={18} />
                                            <span>Rejected Rows ({result.rejectedRows.length})</span>
                                        </h3>

                                        <button
                                            className="btn-secondary"
                                            onClick={downloadErrorLog}
                                            style={{ fontSize: "0.8rem", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                        >
                                            <Download size={14} />
                                            <span>Download Errors CSV</span>
                                        </button>
                                    </div>

                                    <div style={{ maxHeight: "280px", overflowY: "auto", border: "1px solid #ffe4e6", borderRadius: "var(--radius-md)", background: "#fff" }}>
                                        {result.rejectedRows.map((rowItem) => (
                                            <div
                                                key={rowItem.rowNumber}
                                                className="rejected-row"
                                                style={{ padding: "12px 16px", borderBottom: "1px solid #ffe4e6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: "0.875rem" }}
                                            >
                                                <div>
                                                    <strong style={{ color: "#9f1239", marginRight: "8px" }}>
                                                        Row {rowItem.rowNumber}
                                                    </strong>
                                                    <span style={{ color: "#be123c" }}>
                                                        {(rowItem.errors || []).join(", ")}
                                                    </span>
                                                </div>
                                                {rowItem.data?.content && (
                                                    <span style={{ color: "var(--text-subtle)", fontSize: "0.75rem", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                        "{rowItem.data.content}"
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: "flex", gap: "12px", marginTop: "2rem" }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setResult(null)}
                                    style={{ flex: 1 }}
                                >
                                    Import Another CSV
                                </button>
                                <Link
                                    to="/feedback"
                                    className="btn-primary"
                                    style={{ flex: 1, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                                >
                                    <span>View Feedback Hub</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Simulated Channel Sync View */
                <div style={{ maxWidth: "840px", margin: "0 auto" }}>
                    {simulatedMsg && (
                        <div className="alert-success" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <CheckCircle2 size={18} />
                            <span>{simulatedMsg}</span>
                        </div>
                    )}

                    <div className="auth-card" style={{ maxWidth: "100%", marginBottom: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <Radio size={22} color="var(--primary)" />
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                                Simulated Channel Integration Sync
                            </h3>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                            Select a simulated channel integration source below to trigger a mock live data stream sync. Ingested items will be queued with <code>aiStatus: "PENDING"</code> for background AI analysis.
                        </p>

                        <div style={{ display: "grid", gap: "12px", marginBottom: "1.75rem" }}>
                            {channelCards.map((card) => {
                                const IconComp = card.icon;
                                const isSelected = selectedChannel === card.id;
                                return (
                                    <div
                                        key={card.id}
                                        onClick={() => setSelectedChannel(card.id)}
                                        style={{
                                            padding: "16px",
                                            borderRadius: "12px",
                                            border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                                            backgroundColor: isSelected ? "rgba(99, 102, 241, 0.04)" : "var(--bg-card)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <div style={{
                                            padding: "10px",
                                            borderRadius: "10px",
                                            backgroundColor: isSelected ? "var(--primary)" : "#f1f5f9",
                                            color: isSelected ? "white" : "var(--text-muted)"
                                        }}>
                                            <IconComp size={20} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: "0.95rem", color: "var(--text-main)", display: "block" }}>
                                                {card.label}
                                            </strong>
                                            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                                                {card.desc}
                                            </span>
                                        </div>

                                        <input
                                            type="radio"
                                            name="channel_select"
                                            checked={isSelected}
                                            onChange={() => setSelectedChannel(card.id)}
                                            style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handleSimulatePull}
                            disabled={simulating}
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center", padding: "12px" }}
                        >
                            {simulating ? (
                                <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <Sparkles size={18} />
                            )}
                            <span>{simulating ? "Syncing Channel Stream..." : `Trigger Simulated ${selectedChannel} Sync`}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImportFeedback;
