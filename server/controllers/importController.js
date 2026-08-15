const fs = require("fs");
const Feedback = require("../models/Feedback");
const { parseCSVFile } = require("../utils/csvImport");
const { validateHeaders, validateRow } = require("../validators/csvValidator");
const { queueFeedbackAnalysisBulk } = require("../queues/feedbackJobProducer");

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
            const feedback = {
                workspace: req.user.workspace,
                content: row.content.trim(),
                channel: row.channel.trim().toUpperCase(),
                customerLabel: row.customerlabel?.trim() || null,
                aiStatus: "PENDING",
                status: "NEW"
            };

            if (row.createdat) {
                const parsedDate = new Date(row.createdat);
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
                const insertedIds = inserted.map((doc) => doc._id);
                await queueFeedbackAnalysisBulk(insertedIds);
            } catch (qErr) {
                console.warn("Failed to queue bulk AI jobs for CSV import:", qErr.message);
            }
        }

        res.status(201).json({
            message: "CSV import completed",
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
