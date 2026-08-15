const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
    getReport,
    generateVoCReport,
    getSavedReports,
    getSavedReportById,
    exportReportCSV,
    exportReportPDF
} = require("../controllers/reportController");

router.get("/", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getReport);
router.post("/voc", auth, allowRoles("ADMIN", "ANALYST"), generateVoCReport);
router.get("/saved", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getSavedReports);
router.get("/saved/:id", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getSavedReportById);
router.get("/export/csv", auth, allowRoles("ADMIN", "ANALYST"), exportReportCSV);
router.get("/export/pdf", auth, allowRoles("ADMIN", "ANALYST"), exportReportPDF);

module.exports = router;
