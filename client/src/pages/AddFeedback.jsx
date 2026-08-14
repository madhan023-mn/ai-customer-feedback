import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
    Edit3,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle2,
    UploadCloud,
    FileText,
    Send,
    Radio,
    RefreshCw,
    Sparkles
} from "lucide-react";

function AddFeedback() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("single"); // "single", "csv", or "simulated"

    // Single Form State
    const [form, setForm] = useState({
        content: "",
        channel: "SUPPORT_TICKET",
        customerLabel: "",
        sentiment: "NEU",
        featureArea: "",
        rationale: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // CSV File State
    const [csvFile, setCsvFile] = useState(null);

    // Simulated Channel State
    const [selectedChannel, setSelectedChannel] = useState("SUPPORT_TICKET");
    const [simulating, setSimulating] = useState(false);

    async function handleSimulatePull() {
        setError("");
        setSuccessMsg("");
        setSimulating(true);

        try {
            const res = await api.post("/feedback/simulate", { channel: selectedChannel });
            setSuccessMsg(res.data.message || `Successfully ingested simulated items from ${selectedChannel}!`);
            setTimeout(() => navigate("/feedback"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to simulate channel ingestion");
        } finally {
            setSimulating(false);
        }
    }

    function handleSingleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    async function handleSingleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            await api.post("/feedback", form);
            setSuccessMsg("Feedback entry created successfully!");
            setForm({
                content: "",
                channel: "SUPPORT_TICKET",
                customerLabel: "",
                sentiment: "NEU",
                featureArea: "",
                rationale: ""
            });
            setTimeout(() => navigate("/feedback"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create feedback");
        } finally {
            setLoading(false);
        }
    }

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

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Add Feedback</h1>
                    <p className="page-subtitle">Submit single feedback or import bulk dataset via CSV</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === "single" ? "active" : ""}`}
                    onClick={() => { setActiveTab("single"); setError(""); setSuccessMsg(""); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <Edit3 size={16} />
                    <span>Single Entry</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === "csv" ? "active" : ""}`}
                    onClick={() => { setActiveTab("csv"); setError(""); setSuccessMsg(""); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <FileSpreadsheet size={16} />
                    <span>Bulk CSV Import</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === "simulated" ? "active" : ""}`}
                    onClick={() => { setActiveTab("simulated"); setError(""); setSuccessMsg(""); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <Radio size={16} />
                    <span>Simulate Integration</span>
                </button>
            </div>

            {error && (
                <div className="alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            {successMsg && (
                <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={18} />
                    <span>{successMsg}</span>
                </div>
            )}

            {activeTab === "single" ? (
                /* Single Entry Form Card */
                <div className="auth-card" style={{ maxWidth: "680px", margin: "0 auto" }}>
                    <form onSubmit={handleSingleSubmit}>
                        <div className="form-group">
                            <label>Feedback Content *</label>
                            <textarea
                                name="content"
                                className="textarea-field"
                                placeholder="Describe what the customer said or reported..."
                                value={form.content}
                                onChange={handleSingleChange}
                                required
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                            <div className="form-group">
                                <label>Channel *</label>
                                <select
                                    name="channel"
                                    className="select-field"
                                    value={form.channel}
                                    onChange={handleSingleChange}
                                >
                                    <option value="SUPPORT_TICKET">Support Ticket</option>
                                    <option value="APP_STORE">App Store Review</option>
                                    <option value="NPS_SURVEY">NPS Survey</option>
                                    <option value="SALES_CALL">Sales Call</option>
                                    <option value="COMMUNITY">Community</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Sentiment Tag</label>
                                <select
                                    name="sentiment"
                                    className="select-field"
                                    value={form.sentiment}
                                    onChange={handleSingleChange}
                                >
                                    <option value="POS">Positive (POS)</option>
                                    <option value="NEU">Neutral (NEU)</option>
                                    <option value="NEG">Negative (NEG)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                            <div className="form-group">
                                <label>Customer Label / Segment</label>
                                <input
                                    type="text"
                                    name="customerLabel"
                                    className="input-field"
                                    placeholder="e.g. Enterprise Client A, VIP User"
                                    value={form.customerLabel}
                                    onChange={handleSingleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Feature Area</label>
                                <input
                                    type="text"
                                    name="featureArea"
                                    className="input-field"
                                    placeholder="e.g. Checkout, Onboarding, Search"
                                    value={form.featureArea}
                                    onChange={handleSingleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Product Rationale / Notes</label>
                            <input
                                type="text"
                                name="rationale"
                                className="input-field"
                                placeholder="Why this feedback matters or potential action item..."
                                value={form.rationale}
                                onChange={handleSingleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                            <Send size={16} />
                            <span>{loading ? "Saving Feedback..." : "Submit Feedback Entry"}</span>
                        </button>
                    </form>
                </div>
            ) : activeTab === "csv" ? (
                /* CSV Import Tab */
                <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                    <div className="auth-card" style={{ marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                            Upload Feedback CSV File
                        </h3>

                        <form onSubmit={handleCsvSubmit}>
                            <label className="dropzone" style={{ display: "block" }}>
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
                            <span>CSV Format Guide</span>
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                            Your CSV file should include a header row with column names matching:
                        </p>
                        <div className="table-responsive">
                            <table className="custom-table" style={{ fontSize: "0.85rem" }}>
                                <thead>
                                    <tr>
                                        <th>Column Name</th>
                                        <th>Required</th>
                                        <th>Sample Values</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>content</strong></td>
                                        <td>Yes</td>
                                        <td>"App crashed on checkout screen"</td>
                                    </tr>
                                    <tr>
                                        <td><strong>channel</strong></td>
                                        <td>No</td>
                                        <td>SUPPORT_TICKET, APP_STORE, NPS_SURVEY</td>
                                    </tr>
                                    <tr>
                                        <td><strong>sentiment</strong></td>
                                        <td>No</td>
                                        <td>POS, NEU, NEG</td>
                                    </tr>
                                    <tr>
                                        <td><strong>customerLabel</strong></td>
                                        <td>No</td>
                                        <td>Acme Corp</td>
                                    </tr>
                                    <tr>
                                        <td><strong>featureArea</strong></td>
                                        <td>No</td>
                                        <td>Payments</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* Simulated Channel Sync Tab */
                <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                    <div className="auth-card">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <Radio size={22} color="var(--primary)" />
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Simulated Channel Source Sync</h3>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                            Select a target channel below to simulate a live customer feedback integration stream.
                        </p>

                        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                            <label>Target Channel Integration *</label>
                            <select
                                className="select-field"
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                            >
                                <option value="SUPPORT_TICKET">Zendesk Support Tickets</option>
                                <option value="APP_STORE">App Store Reviews</option>
                                <option value="SALES_CALL">Sales Call Notes</option>
                                <option value="NPS_SURVEY">NPS Survey Feedback</option>
                                <option value="COMMUNITY">Community Forum Stream</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handleSimulatePull}
                            disabled={simulating}
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center" }}
                        >
                            {simulating ? (
                                <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <Sparkles size={18} />
                            )}
                            <span>{simulating ? "Pulling Stream & Classifying..." : `Simulate ${selectedChannel} Integration Sync`}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddFeedback;