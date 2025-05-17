const express = require("express");
const router = express.Router();
const {
  getStats,
  toggleAdminStatus,
  moderateCause,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getAllCauses,
  updateCauseStatus,
  deleteCause,
  getActivities,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// Admin routes
router.get("/stats", protect, admin, getStats);
router.put("/users/:id/toggle-admin", protect, admin, toggleAdminStatus);
router.put("/causes/:id/moderate", protect, admin, moderateCause);

// Admin users management
router.get("/users", protect, admin, getUsers);
router.post("/users", protect, admin, createUser);
router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);

// Admin causes management
router.get("/causes", protect, admin, getAllCauses);
router.patch("/causes/:id/status", protect, admin, updateCauseStatus);
router.delete("/causes/:id", protect, admin, deleteCause);

// Admin activities
router.get("/activities", protect, admin, getActivities);

module.exports = router;
