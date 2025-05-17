const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addField,
  updateField,
  deleteField,
  updateFieldOrder,
} = require("../controllers/categoryController");

// Routes that need admin access
router.post("/", protect, admin, createCategory);
router.get("/", protect, admin, getCategories);
router.get("/:id", protect, admin, getCategoryById);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);
router.post("/:id/fields", protect, admin, addField);
router.put("/:categoryId/fields/:id", protect, admin, updateField);
router.delete("/:categoryId/fields/:id", protect, admin, deleteField);
router.put("/:id/field-order", protect, admin, updateFieldOrder);

module.exports = router;
