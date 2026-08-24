const router = require("express").Router();

const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const feedbackSchema = require("../validators/feedbackValidator");

const {
    createFeedback,
    getFeedbacks,
    getFeedbackStats,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    analyzeFeedback,
    analyzeAllPendingFeedback,
    retryAIAnalysis,
    importCSV,
    simulateChannelIngestion
} = require("../controllers/feedbackController");

// Get all feedback & statistics
router.get("/", auth, getFeedbacks);
router.get("/stats", auth, getFeedbackStats);

// Create feedback with Zod schema validation
router.post("/", auth, allowRoles("ADMIN", "ANALYST"), validate(feedbackSchema), createFeedback);

// Simulate channel integration pull
router.post("/simulate", auth, allowRoles("ADMIN", "ANALYST"), simulateChannelIngestion);

// AI batch analysis routes
router.post("/analyze-all", auth, allowRoles("ADMIN", "ANALYST"), analyzeAllPendingFeedback);
router.post("/analyze-pending", auth, allowRoles("ADMIN", "ANALYST"), analyzeAllPendingFeedback);

// AI single analysis & retry routes
router.post("/:id/analyze", auth, allowRoles("ADMIN", "ANALYST"), validateObjectId("id"), analyzeFeedback);
router.post("/:id/retry-ai", auth, allowRoles("ADMIN", "ANALYST"), validateObjectId("id"), retryAIAnalysis);

// Bulk CSV import (supports both /upload and /import)
router.post("/upload", auth, allowRoles("ADMIN", "ANALYST"), upload.single("file"), importCSV);
router.post("/import", auth, allowRoles("ADMIN", "ANALYST"), upload.single("file"), importCSV);

// Get single feedback by ID
router.get("/:id", auth, validateObjectId("id"), getFeedbackById);

// Update feedback status/fields
router.patch("/:id", auth, allowRoles("ADMIN", "ANALYST"), validateObjectId("id"), updateFeedback);
router.patch("/:id/status", auth, allowRoles("ADMIN", "ANALYST"), validateObjectId("id"), updateFeedback);

// Delete feedback
router.delete("/:id", auth, allowRoles("ADMIN"), validateObjectId("id"), deleteFeedback);

module.exports = router;