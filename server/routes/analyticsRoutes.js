const router = require("express").Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
    getAnalyticsOverview,
    getSentimentTrend,
    getFeedbackVolumeTrend,
    getThemeTrend,
    getChannelSentiment
} = require("../controllers/analyticsController");

router.get("/overview", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getAnalyticsOverview);
router.get("/trend", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getSentimentTrend);
router.get("/volume", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getFeedbackVolumeTrend);
router.get("/theme-trend", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getThemeTrend);
router.get("/channel-sentiment", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getChannelSentiment);
router.get("/", auth, allowRoles("ADMIN", "ANALYST", "VIEWER"), getAnalyticsOverview);

module.exports = router;
