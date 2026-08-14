const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
    analyzeSingleFeedback,
    analyzePendingFeedback,
    retryFailedFeedback,
    askLoop
} = require("../controllers/aiController");

router.post(
    "/ask",
    auth,
    askLoop
);

router.post(
    "/feedback/analyze-pending",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    analyzePendingFeedback
);

router.post(
    "/feedback/:id/analyze",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    analyzeSingleFeedback
);

router.post(
    "/feedback/:id/retry",
    auth,
    allowRoles("ADMIN", "ANALYST"),
    retryFailedFeedback
);

module.exports = router;