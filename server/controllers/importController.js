const fs = require("fs");
const Feedback = require("../models/Feedback");
const { parseCSVFile } = require("../utils/csvImport");
const { validateHeaders, validateRow, findContentColumn, normalizeKey } = require("../validators/csvValidator");
const { queueFeedbackAnalysisBulk } = require("../queues/feedbackJobProducer");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

async function importFeedbackCSV(req, res) {
    let tempPath = null;

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a CSV file"
            });
        }

        const csvSource = req.file.buffer || req.file.path;
        if (!csvSource) {
            return res.status(400).json({
                message: "No CSV content received in request"
            });
        }

        if (req.file.path) {
            tempPath = req.file.path;
        }

        const rows = await parseCSVFile(csvSource);

        if (!rows || rows.length === 0) {
            return res.status(400).json({
                message: "The uploaded CSV file is empty or could not be parsed."
            });
        }

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
                validRows.push({ row, content: validation.content });
            } else {
                rejectedRows.push({
                    rowNumber,
                    errors: validation.errors,
                    data: row
                });
            }
        });

        const feedbackDocuments = validRows.map(({ row, content }) => {
            const getValByKeys = (possibleKeys) => {
                if (!row || typeof row !== "object") return "";
                const rowKeys = Object.keys(row);
                for (const pk of possibleKeys) {
                    const normPk = normalizeKey(pk);
                    for (const rk of rowKeys) {
                        if (normalizeKey(rk) === normPk) {
                            const val = row[rk];
                            if (val !== undefined && val !== null && String(val).trim() !== "") {
                                return String(val).trim();
                            }
                        }
                    }
                }
                return "";
            };

            let rawChannel = getValByKeys(["channel", "source", "type", "platform", "origin"]);
            let channel = "SUPPORT_TICKET";
            if (rawChannel) {
                const upper = rawChannel.toUpperCase();
                if (upper.includes("APP") || upper.includes("STORE") || upper.includes("REVIEW")) channel = "APP_STORE";
                else if (upper.includes("NPS") || upper.includes("SURVEY")) channel = "NPS_SURVEY";
                else if (upper.includes("SALES") || upper.includes("CALL")) channel = "SALES_CALL";
                else if (upper.includes("COMMUNITY") || upper.includes("FORUM") || upper.includes("POST") || upper.includes("TWITTER") || upper.includes("SOCIAL")) channel = "COMMUNITY";
                else if (upper.includes("TICKET") || upper.includes("SUPPORT") || upper.includes("EMAIL") || upper.includes("WEB")) channel = "SUPPORT_TICKET";
                else channel = upper.substring(0, 30);
            }

            const customerLabel = getValByKeys([
                "customerlabel",
                "customername",
                "customer",
                "user",
                "username",
                "client",
                "name",
                "author"
            ]);

            const createdAtStr = getValByKeys(["createdat", "created_at", "date", "timestamp", "time"]);

            const feedback = {
                workspace: req.user.workspace,
                content: content,
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
            message: `Successfully imported ${insertedCount} feedback entries!`,
            count: insertedCount,
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
        if (tempPath && fs.existsSync(tempPath)) {
            try {
                fs.unlinkSync(tempPath);
            } catch (e) {}
        }
    }
}

module.exports = {
    importFeedbackCSV
};
