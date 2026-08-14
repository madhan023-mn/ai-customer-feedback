const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { generateThemeInsight, getInsights } = require("../controllers/insightController");

router.post(
    "/theme/:theme/generate",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    generateThemeInsight
);

router.get(
    "/",
    auth,
    getInsights
);

module.exports = router;
