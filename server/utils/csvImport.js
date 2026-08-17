const fs = require("fs");
const { parse } = require("csv-parse");

function normalizeHeader(header) {
    if (header === undefined || header === null) return "";
    return String(header)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function normalizeRow(row) {
    const normalized = {};
    if (!row || typeof row !== "object") return normalized;

    Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeHeader(key);
        if (normalizedKey) {
            normalized[normalizedKey] = row[key] !== undefined && row[key] !== null ? String(row[key]) : "";
        }
    });
    return normalized;
}

function parseCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                    bom: true,
                    relax_column_count: true
                })
            )
            .on("data", (row) => {
                rows.push(normalizeRow(row));
            })
            .on("end", () => {
                resolve(rows);
            })
            .on("error", reject);
    });
}

module.exports = {
    normalizeHeader,
    normalizeRow,
    parseCSVFile
};
