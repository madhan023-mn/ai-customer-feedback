import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    Users
} from "lucide-react";

function ImportFeedback() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("csv"); // "csv" or "simulated"

    // CSV File State
    const [csvFile, setCsvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Simulated Channel State
    const [selectedChannel, setSelectedChannel] = useState("SUPPORT_TICKET");
    const [simulating, setSimulating] = useState(false);

    async function handleCsvSubmit(e) {
        e.preventDefault();
        if (!csvFile) {
            setError("Please select a CSV file to upload");
            return;
        }

        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", csvFile);

            const res = await api.post("/feedback/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccessMsg(res.data.message || `Successfully imported ${res.data.count} feedback items!`);
            setCsvFile(null);
            setTimeout(() => navigate("/feedback"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload CSV");
        } finally {
            setLoading(false);
        }
    }

    async function handleSimulatePull() {
        setError("");
        setSuccessMsg("");
        setSimulating(true);

        try {
            const res = await api.post("/feedback/simulate", { channel: selectedChannel });
            setSuccessMsg(res.data.message || `Successfully ingested ${res.data.count} simulated items from ${selectedChannel}!`);
            setTimeout(() => navigate("/feedback"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to simulate channel ingestion");
        } finally {
            setSimulating(false);
        }
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
                    <p className="page-subtitle">Bulk import customer feedback via CSV or trigger simulated channel syncs</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-header" style={{ marginBottom: "2rem" }}>
                <button
                    className={`tab-btn ${activeTab === "csv" ? "active" : ""}`}
                    onClick={() => { setActiveTab("csv"); setError(""); setSuccessMsg(""); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <FileSpreadsheet size={16} />
                    <span>Bulk CSV Upload</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === "simulated" ? "active" : ""}`}
                    onClick={() => { setActiveTab("simulated"); setError(""); setSuccessMsg(""); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <Radio size={16} />
                    <span>Simulated Channel Integration</span>
                </button>
            </div>

            {error && (
                <div className="alert-error" style={{ maxWidth: "780px", margin: "0 auto 1.5rem auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            {successMsg && (
                <div className="alert-success" style={{ maxWidth: "780px", margin: "0 auto 1.5rem auto", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={18} />
                    <span>{successMsg}</span>
                </div>
            )}

            {activeTab === "csv" ? (
                /* CSV Import View */
                <div style={{ maxWidth: "780px", margin: "0 auto" }}>
                    <div className="auth-card" style={{ marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                            Upload Customer Feedback CSV
                        </h3>

                        <form onSubmit={handleCsvSubmit}>
                            <label className="dropzone" style={{ display: "block", cursor: "pointer" }}>
                                <div className="dropzone-icon">
                                    <UploadCloud size={40} />
                                </div>
                                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                                    {csvFile ? csvFile.name : "Click or Drag & Drop CSV File"}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                                    Supports .csv files up to 5MB
                                </div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    style={{ display: "none" }}
                                    onChange={(e) => setCsvFile(e.target.files[0])}
                                />
                            </label>

                            {csvFile && (
                                <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FileText size={16} />
                                    <span>Selected file: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !csvFile}
                                style={{ marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
                            >
                                <UploadCloud size={18} />
                                <span>{loading ? "Uploading & Ingesting..." : "Process & Import CSV Data"}</span>
                            </button>
                        </form>
                    </div>

                    {/* CSV Formatting Guide */}
                    <div className="table-card" style={{ padding: "1.5rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FileSpreadsheet size={16} />
                            <span>CSV Format Specification</span>
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                            Your CSV file should include headers matching these column names. AI auto-classifier will auto-fill sentiment and themes on import.
                        </p>
                        <div className="table-responsive">
                            <table className="custom-table" style={{ fontSize: "0.85rem" }}>
                                <thead>
                                    <tr>
                                        <th>Column Header</th>
                                        <th>Required</th>
                                        <th>Accepted Values / Examples</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>content</strong></td>
                                        <td>Yes</td>
                                        <td>"Onboarding took forever — couldn't invite my team."</td>
                                    </tr>
                                    <tr>
                                        <td><strong>channel</strong></td>
                                        <td>No</td>
                                        <td>SUPPORT_TICKET, APP_STORE, NPS_SURVEY, SALES_CALL, COMMUNITY</td>
                                    </tr>
                                    <tr>
                                        <td><strong>customer_label</strong></td>
                                        <td>No</td>
                                        <td>Acme Corp Enterprise</td>
                                    </tr>
                                    <tr>
                                        <td><strong>sentiment</strong></td>
                                        <td>No</td>
                                        <td>POS, NEU, NEG (auto-classified if blank)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>feature_area</strong></td>
                                        <td>No</td>
                                        <td>Checkout, Onboarding, Mobile (auto-classified if blank)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* Simulated Channel Sync View */
                <div style={{ maxWidth: "780px", margin: "0 auto" }}>
                    <div className="auth-card" style={{ marginBottom: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <Radio size={22} color="var(--primary)" />
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                                Simulated Channel Integration Sync
                            </h3>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                            Select a simulated channel integration source below to trigger a mock live data stream sync. Newly ingested items will automatically undergo AI classification.
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
                            <span>{simulating ? "Syncing & Auto-Classifying Stream..." : `Trigger Simulated ${selectedChannel} Sync`}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImportFeedback;
