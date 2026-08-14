const router = require("express").Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const upload = require("../middleware/upload");
const { importFeedbackCSV } = require("../controllers/importController");

router.post(
    "/feedback",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    upload.single("file"),
    importFeedbackCSV
);

module.exports = router;
