const router = require("express").Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { getAnalyticsOverview } = require("../controllers/analyticsController");

router.get("/overview", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getAnalyticsOverview);
router.get("/", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getAnalyticsOverview);

module.exports = router;
