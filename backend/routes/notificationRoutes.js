const express = require("express");
const router = express.Router();
const {
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getUserNotifications,
  createAdminNotification,
  createMilestoneNotification,
} = require("../controllers/notificationController");
const { protect, admin } = require("../middleware/authMiddleware");

// Private routes (require login)
router.get("/", protect, getUserNotifications);
router.put("/:id", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.get("/unread-count", protect, getUnreadCount);

// Admin routes
router.post("/admin", protect, admin, createAdminNotification);

// Cause owner routes
router.post("/milestone/:causeId", protect, createMilestoneNotification);

module.exports = router;
