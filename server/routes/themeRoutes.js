const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getThemes, getThemeTrends, getThemeTrend, getThemeDetails } = require("../controllers/themeController");

router.get("/", auth, getThemes);
router.get("/trends", auth, getThemeTrends);
router.get("/:theme/trend", auth, getThemeTrend);
router.get("/:theme", auth, getThemeDetails);

module.exports = router;
