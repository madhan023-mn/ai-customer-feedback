const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { getReport, exportReportCSV, exportReportPDF } = require("../controllers/reportController");

router.get("/", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getReport);
router.get("/export/csv", auth, allowRoles("ADMIN", "ANALYST"), exportReportCSV);
router.get("/export/pdf", auth, allowRoles("ADMIN", "ANALYST"), exportReportPDF);

module.exports = router;
