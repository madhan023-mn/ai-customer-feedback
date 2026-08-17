const fs = require("fs");
const Feedback = require("../models/Feedback");
const { parseCSVFile } = require("../utils/csvImport");
const { validateHeaders, validateRow } = require("../validators/csvValidator");
const { queueFeedbackAnalysisBulk } = require("../queues/feedbackJobProducer");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

async function importFeedbackCSV(req, res) {
    let uploadedFile = null;

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a CSV file"
            });
        }

        uploadedFile = req.file.path;

        const rows = await parseCSVFile(uploadedFile);

        const headerValidation = validateHeaders(rows);
        if (!headerValidation.valid) {
            return res.status(400).json({
                message: headerValidation.error
            });
        }

        const validRows = [];
        const rejectedRows = [];

        rows.forEach((row, index) => {
            const rowNumber = index + 2; // Row 1 = Headers, Data starts at Row 2
            const validation = validateRow(row, rowNumber);

            if (validation.valid) {
                validRows.push(row);
            } else {
                rejectedRows.push({
                    rowNumber,
                    errors: validation.errors,
                    data: row
                });
            }
        });

        const feedbackDocuments = validRows.map((row) => {
            const getVal = (possibleKeys) => {
                if (!row || typeof row !== "object") return "";
                for (const k of possibleKeys) {
                    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
                        return String(row[k]).trim();
                    }
                }
                return "";
            };

            const content = getVal(["content", "feedback", "text", "comment", "message"]);
            let rawChannel = getVal(["channel", "source", "type"]).toUpperCase();

            let channel = "SUPPORT_TICKET";
            if (rawChannel.includes("APP") || rawChannel.includes("STORE") || rawChannel.includes("REVIEW")) channel = "APP_STORE";
            else if (rawChannel.includes("NPS") || rawChannel.includes("SURVEY")) channel = "NPS_SURVEY";
            else if (rawChannel.includes("SALES") || rawChannel.includes("CALL")) channel = "SALES_CALL";
            else if (rawChannel.includes("COMMUNITY") || rawChannel.includes("FORUM") || rawChannel.includes("POST")) channel = "COMMUNITY";
            else if (rawChannel.includes("TICKET") || rawChannel.includes("SUPPORT")) channel = "SUPPORT_TICKET";

            const customerLabel = getVal(["customerlabel", "customer", "user", "client", "name"]);
            const createdAtStr = getVal(["createdat", "created_at", "date", "time"]);

            const feedback = {
                workspace: req.user.workspace,
                content: content || "No content provided",
                channel,
                customerLabel: customerLabel || null,
                aiStatus: "PENDING",
                status: "NEW"
            };

            if (createdAtStr) {
                const parsedDate = new Date(createdAtStr);
                if (!Number.isNaN(parsedDate.getTime())) {
                    feedback.createdAt = parsedDate;
                }
            }

            return feedback;
        });

        let insertedCount = 0;
        if (feedbackDocuments.length > 0) {
            const inserted = await Feedback.insertMany(feedbackDocuments);
            insertedCount = inserted.length;

            try {
                const insertedIds = inserted.map((doc) => doc ? String(doc._id) : null).filter(Boolean);
                await queueFeedbackAnalysisBulk(insertedIds);
                processPendingFeedback(insertedCount, req.user.workspace).catch(() => {});
            } catch (qErr) {
                console.warn("Failed to queue bulk AI jobs for CSV import:", qErr.message);
            }
        }

        res.status(201).json({
            message: "CSV import completed successfully",
            summary: {
                totalRows: rows.length,
                validRows: validRows.length,
                rejectedRows: rejectedRows.length,
                insertedRows: insertedCount
            },
            rejectedRows
        });
    } catch (error) {
        console.error("CSV import error:", error);
        res.status(500).json({
            message: "CSV import failed: " + (error.message || "Unknown error")
        });
    } finally {
        if (uploadedFile && fs.existsSync(uploadedFile)) {
            fs.unlink(uploadedFile, (unlinkErr) => {
                if (unlinkErr) console.warn("Failed to delete temp upload file:", unlinkErr);
            });
        }
    }
}

module.exports = {
    importFeedbackCSV
};
