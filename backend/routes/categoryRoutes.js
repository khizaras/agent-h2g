const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getPublicCategories,
  getPublicCategoryById,
  getCauseFieldValues,
  saveCauseFieldValues,
} = require("../controllers/categoryController");

// Public routes
router.get("/", getPublicCategories);
router.get("/:id", getPublicCategoryById);

// Routes for cause-specific category field values
router.get("/cause/:causeId/values", getCauseFieldValues);
router.post("/cause/:causeId/values", protect, saveCauseFieldValues);

module.exports = router;
