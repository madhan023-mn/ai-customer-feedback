const router = require("express").Router();

const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const upload = require("../middleware/upload");

const {
    createFeedback,
    getFeedbacks,
    getFeedback,
    getFeedbackStats,
    getFeedbackById,
    updateFeedback,
    updateFeedbackStatus,
    deleteFeedback,
    analyzeFeedback,
    importCSV,
    importFeedbackCsv,
    simulateChannelIngestion
} = require("../controllers/feedbackController");

// Get all feedback & statistics
router.get("/", auth, getFeedbacks);
router.get("/stats", auth, getFeedbackStats);

// Create feedback
router.post("/", auth, allowRoles("ADMIN", "ANALYST"), createFeedback);

// Simulate channel integration pull
router.post("/simulate", auth, allowRoles("ADMIN", "ANALYST"), simulateChannelIngestion);

// AI analysis route
router.post("/:id/analyze", auth, allowRoles("ADMIN", "ANALYST"), analyzeFeedback);

// Bulk CSV import (supports both /upload and /import)
router.post("/upload", auth, allowRoles("ADMIN", "ANALYST"), upload.single("file"), importCSV);
router.post("/import", auth, allowRoles("ADMIN", "ANALYST"), upload.single("file"), importCSV);

// Get single feedback by ID
router.get("/:id", auth, getFeedbackById);

// Update feedback status/fields
router.patch("/:id", auth, allowRoles("ADMIN", "ANALYST"), updateFeedback);
router.patch("/:id/status", auth, allowRoles("ADMIN", "ANALYST"), updateFeedback);

// Delete feedback
router.delete("/:id", auth, allowRoles("ADMIN"), deleteFeedback);

module.exports = router;