const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { getDashboardSummary } = require("../controllers/dashboardController");

router.get("/summary", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getDashboardSummary);
router.get("/analytics", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getDashboardSummary);
router.get("/stats", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getDashboardSummary);
router.get("/", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getDashboardSummary);

module.exports = router;
