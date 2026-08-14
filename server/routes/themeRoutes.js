const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getThemes, getThemeTrend, getThemeDetails } = require("../controllers/themeController");

router.get("/", auth, getThemes);
router.get("/:theme/trend", auth, getThemeTrend);
router.get("/:theme", auth, getThemeDetails);

module.exports = router;
