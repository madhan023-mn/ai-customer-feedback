const router = require("express").Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
    getInsights,
    triggerInsightGeneration,
    generateThemeInsight
} = require("../controllers/insightController");

router.get(
    "/",
    auth,
    allowRoles("ADMIN", "ANALYST", "VIEWER"),
    getInsights
);

router.post(
    "/generate",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    triggerInsightGeneration
);

router.post(
    "/theme/:theme/generate",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    generateThemeInsight
);

module.exports = router;
