const REQUIRED_COLUMNS = ["content", "channel"];
const OPTIONAL_COLUMNS = ["customerlabel", "createdat"];

const ALLOWED_CHANNELS = [
    "SURVEY",
    "SUPPORT_TICKET",
    "APP_REVIEW",
    "EMAIL",
    "SOCIAL",
    "COMMUNITY",
    "SALES_CALL",
    "APP_STORE",
    "NPS_SURVEY"
];

function validateHeaders(rows) {
    if (!rows || !rows.length) {
        return {
            valid: false,
            error: "CSV file is empty or contains no data rows"
        };
    }

    const firstRowKeys = Object.keys(rows[0] || {});
    const hasContentHeader = firstRowKeys.some(k => ["content", "feedback", "text", "comment", "message"].includes(k));

    if (!hasContentHeader) {
        return {
            valid: false,
            error: "Missing required CSV 'content' header."
        };
    }

    return { valid: true };
}

function validateRow(row, rowNumber) {
    const errors = [];

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
    if (!content) {
        errors.push("content is required");
    }

    return {
        valid: errors.length === 0,
        rowNumber,
        errors
    };
}

module.exports = {
    REQUIRED_COLUMNS,
    OPTIONAL_COLUMNS,
    ALLOWED_CHANNELS,
    validateHeaders,
    validateRow
};
