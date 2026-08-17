const CONTENT_COLUMNS = [
    "content",
    "feedback",
    "feedbacktext",
    "review",
    "reviewtext",
    "comment",
    "comments",
    "text",
    "message",
    "customerfeedback",
    "customercomment",
    "userfeedback",
    "response",
    "description",
    "opinion",
    "suggestion",
    "complaint",
    "remarks"
];

const OPTIONAL_COLUMNS = [
    "channel",
    "customerlabel",
    "customername",
    "customer",
    "createdat",
    "date",
    "rating",
    "sentiment",
    "category",
    "product",
    "feature",
    "customerid",
    "userid",
    "location",
    "language"
];

function normalizeKey(str) {
    return String(str || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function findContentColumn(row) {
    if (!row || typeof row !== "object") return null;
    const keys = Object.keys(row);
    for (const k of keys) {
        const normKey = normalizeKey(k);
        if (CONTENT_COLUMNS.includes(normKey)) {
            return k;
        }
    }
    return null;
}

function validateHeaders(rows) {
    if (!rows || !rows.length) {
        return {
            valid: false,
            error: "CSV file is empty or contains no data rows"
        };
    }

    const contentCol = findContentColumn(rows[0] || {});
    if (!contentCol) {
        return {
            valid: false,
            error: "CSV must contain a feedback text column such as content, feedback, review, comment, text, or message."
        };
    }

    return { valid: true, contentCol };
}

function validateRow(row, rowNumber) {
    const errors = [];
    const contentCol = findContentColumn(row);
    const content = contentCol && row[contentCol] ? String(row[contentCol]).trim() : "";

    if (!content) {
        errors.push("Feedback text content is required");
    }

    return {
        valid: errors.length === 0,
        rowNumber,
        errors,
        content
    };
}

module.exports = {
    CONTENT_COLUMNS,
    OPTIONAL_COLUMNS,
    normalizeKey,
    findContentColumn,
    validateHeaders,
    validateRow
};
