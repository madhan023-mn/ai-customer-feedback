const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboardController");

router.get("/analytics", auth, getDashboardStats);
router.get("/stats", auth, getDashboardStats);
router.get("/", auth, getDashboardStats);

module.exports = router;
