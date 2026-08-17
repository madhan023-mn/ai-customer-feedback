const multer = require("multer");
const path = require("path");

// Memory storage works seamlessly in Serverless, Vercel, Render, and Localhost
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isCsv = extension === ".csv" ||
                  extension === ".txt" ||
                  file.mimetype === "text/csv" ||
                  file.mimetype === "text/plain" ||
                  file.mimetype === "application/vnd.ms-excel" ||
                  file.mimetype === "application/csv" ||
                  file.mimetype === "application/octet-stream";

    if (!isCsv) {
        return cb(new Error("Only CSV files (.csv) are allowed"), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB limit
    }
});

module.exports = upload;