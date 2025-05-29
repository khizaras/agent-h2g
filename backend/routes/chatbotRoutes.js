const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAdminConversations,
  getConversationBySessionId,
  getUserChatHistory,
  getUserSessionMessages,
  getUserChatStats,
  getPlatformStats,
  getSessionAnalytics,
} = require("../controllers/chatbotController");
const { protect, admin } = require("../middleware/authMiddleware");

// User routes - require authentication
router.post("/", protect, sendMessage);
router.get("/history", protect, getUserChatHistory);
router.get("/history/:sessionId", protect, getUserSessionMessages);
router.get("/stats/user/:userId", protect, getUserChatStats);
router.get("/stats/session/:sessionId", protect, getSessionAnalytics);

// Admin routes - require admin access
router.get("/admin/conversations", protect, admin, getAdminConversations);
router.get(
  "/admin/conversations/:sessionId",
  protect,
  admin,
  getConversationBySessionId
);
router.get("/stats/platform", protect, admin, getPlatformStats);

module.exports = router;
