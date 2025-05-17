const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  getCurrentUser,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  registerValidation,
  loginValidation,
  passwordValidation,
} = require("../middleware/validationMiddleware");

// Public routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/google", googleAuth);

// Private routes
router.get("/me", protect, getCurrentUser);
router.put("/password", protect, passwordValidation, updatePassword);

module.exports = router;
