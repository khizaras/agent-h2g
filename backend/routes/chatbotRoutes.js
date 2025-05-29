const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAdminConversations,
  getConversationBySessionId,
  getUserChatHistory,
  getUserSessionMessages,
} = require("../controllers/chatbotController");
const { protect, admin } = require("../middleware/authMiddleware");

// User routes - require authentication
router.post("/", protect, sendMessage);
router.get("/history", protect, getUserChatHistory);
router.get("/history/:sessionId", protect, getUserSessionMessages);

// Admin routes - require admin access
router.get("/admin/conversations", protect, admin, getAdminConversations);
router.get(
  "/admin/conversations/:sessionId",
  protect,
  admin,
  getConversationBySessionId
);

module.exports = router;
