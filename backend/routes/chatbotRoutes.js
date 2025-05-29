const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatbotController");
const { protect } = require("../middleware/authMiddleware");

// All chatbot routes require authentication
router.post("/", protect, sendMessage);

module.exports = router;
