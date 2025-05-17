const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getUserContributions,
  getFollowedCauses,
  getNotifications,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload, handleUploadError } = require("../middleware/uploadMiddleware");

// Private routes
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  handleUploadError,
  updateProfile
);
router.get("/contributions", protect, getUserContributions);
router.get("/followed-causes", protect, getFollowedCauses);
router.get("/notifications", protect, getNotifications);

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);

module.exports = router;
