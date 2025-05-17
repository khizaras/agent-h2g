const express = require("express");
const router = express.Router();
const {
  createCause,
  getCauses,
  getCauseById,
  updateCause,
  deleteCause,
  getCauseContributions,
  getCauseFeedback,
  addContribution,
  addFeedback,
  followCause,
  unfollowCause,
} = require("../controllers/causeController");
const { protect } = require("../middleware/authMiddleware");
const { upload, handleUploadError } = require("../middleware/uploadMiddleware");
const {
  causeValidation,
  contributionValidation,
  feedbackValidation,
} = require("../middleware/validationMiddleware");

// Public routes
router.get("/", getCauses);
router.get("/:id", getCauseById);
router.get("/:id/contributions", getCauseContributions);
router.get("/:id/feedback", getCauseFeedback);

// Private routes
router.post(
  "/",
  protect,
  upload.single("image"),
  handleUploadError,
  causeValidation,
  createCause
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  handleUploadError,
  causeValidation,
  updateCause
);
router.delete("/:id", protect, deleteCause);
router.post(
  "/:id/contribute",
  protect,
  contributionValidation,
  addContribution
);
router.post("/:id/feedback", protect, feedbackValidation, addFeedback);
router.post("/:id/follow", protect, followCause);
router.post("/:id/unfollow", protect, unfollowCause);

module.exports = router;
