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
    "APP_STORE"
];

function validateHeaders(rows) {
    if (!rows || !rows.length) {
        return {
            valid: false,
            error: "CSV file is empty or contains no data rows"
        };
    }

    const firstRowKeys = Object.keys(rows[0]);
    const missingHeaders = REQUIRED_COLUMNS.filter(col => !firstRowKeys.includes(col));

    if (missingHeaders.length > 0) {
        return {
            valid: false,
            error: `Missing required CSV headers: ${missingHeaders.join(", ")}`
        };
    }

    return { valid: true };
}

function validateRow(row, rowNumber) {
    const errors = [];

    if (!row.content || !row.content.trim()) {
        errors.push("content is required");
    }

    if (!row.channel || !row.channel.trim()) {
        errors.push("channel is required");
    } else {
        const formattedChannel = row.channel.trim().toUpperCase();
        if (!ALLOWED_CHANNELS.includes(formattedChannel)) {
            errors.push(`Invalid channel: ${row.channel}`);
        }
    }

    if (row.createdat) {
        const date = new Date(row.createdat);
        if (Number.isNaN(date.getTime())) {
            errors.push("createdAt is invalid");
        }
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
