const Cause = require("../models/Cause");
const Notification = require("../models/Notification");

// @desc    Create a new cause
// @route   POST /api/causes
// @access  Private
const createCause = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request file type:", req.file ? typeof req.file : "No file");
    console.log("Request files:", req.files);

    if (req.file) {
      console.log("File details:");
      console.log("- fieldname:", req.file.fieldname);
      console.log("- originalname:", req.file.originalname);
      console.log("- mimetype:", req.file.mimetype);
      console.log("- size:", req.file.size);
      if (req.file.imagekit) {
        console.log("- imagekit data present:", req.file.imagekit);
      } else {
        console.log("- NO imagekit data - upload middleware may have failed");
      }
    }

    const {
      title,
      description,
      location,
      category_id,
      funding_goal,
      food_goal,
    } = req.body; // Handle image upload
    let image = null;
    let imageFileId = null;
    if (req.file && req.file.imagekit) {
      image = req.file.imagekit.url;
      imageFileId = req.file.imagekit.fileId;
    }

    console.log("Creating cause with data:", {
      title,
      description,
      image,
      imageFileId,
      location,
      category_id,
      funding_goal: funding_goal || null,
      food_goal: food_goal || null,
      user_id: req.user.id,
    }); // Create cause
    const cause = await Cause.create({
      title,
      description,
      image,
      imageFileId,
      location,
      category_id,
      funding_goal: funding_goal || null,
      food_goal: food_goal || null,
      user_id: req.user.id,
    });

    res.status(201).json({
      success: true,
      cause,
    });
  } catch (error) {
    console.error("Error in createCause:", error);
    res.status(500).json({
      success: false,
      error: "Server error: " + error.message,
    });
  }
};

// @desc    Get all causes
// @route   GET /api/causes
// @access  Public
const getCauses = async (req, res) => {
  try {
    const { category, location, status, search, page, limit } = req.query;

    // Apply filters
    const filters = {
      category,
      location,
      status,
      search,
      page,
      limit,
    };

    const result = await Cause.getAll(filters);

    res.json({
      success: true,
      causes: result.causes,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getCauses:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get cause by ID
// @route   GET /api/causes/:id
// @access  Public
const getCauseById = async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (cause) {
      // Check if user is following (if authenticated)
      let isFollowing = false;
      if (req.user) {
        isFollowing = await Cause.isFollowing(req.user.id, cause.id);
      }

      // Get feedback for this cause
      const feedback = await Cause.getFeedback(cause.id);

      // Get updates for this cause
      const updates = await Cause.getUpdates(cause.id);

      res.json({
        success: true,
        cause: {
          ...cause,
          isFollowing,
          feedback: feedback || [], // Add feedback to the cause object
          updates: updates || [], // Add updates to the cause object
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }
  } catch (error) {
    console.error("Error in getCauseById:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update cause
// @route   PUT /api/causes/:id
// @access  Private
const updateCause = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category_id,
      funding_goal,
      food_goal,
      status,
    } = req.body;

    console.log("Update request body:", req.body);
    console.log("Update request file:", req.file);

    // Check if cause exists
    const cause = await Cause.findById(req.params.id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    console.log("Found cause:", cause);

    // Check ownership or admin
    if (cause.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this cause",
      });
    } // Handle image upload
    let image = cause.image;
    let imageFileId = cause.imageFileId;

    // If there's a new image, update both the URL and file ID
    if (req.file && req.file.imagekit) {
      image = req.file.imagekit.url;
      imageFileId = req.file.imagekit.fileId;

      console.log("New image from ImageKit:", {
        url: image,
        fileId: imageFileId,
      });

      // Delete the old image from ImageKit if it exists
      if (cause.imageFileId) {
        try {
          const { deleteFile } = require("../utils/imageKitService");
          await deleteFile(cause.imageFileId);
          console.log(`Deleted old image with ID ${cause.imageFileId}`);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
          // Continue with the update even if deletion fails
        }
      }
    } else if (req.file) {
      // If there's a file but no imagekit data, something went wrong with ImageKit upload
      console.error(
        "File uploaded but no ImageKit data available. Upload middleware may have failed."
      );
    }

    const updateData = {
      title,
      description,
      image,
      imageFileId,
      location,
      category_id,
      funding_goal: funding_goal || null,
      food_goal: food_goal || null,
      status: status || cause.status,
    };

    console.log("Updating cause with data:", updateData);

    // Update cause
    const updatedCause = await Cause.update(req.params.id, updateData);

    res.json({
      success: true,
      cause: updatedCause,
    });
  } catch (error) {
    console.error("Error in updateCause:", error);
    res.status(500).json({
      success: false,
      error: "Server error: " + error.message,
    });
  }
};

// @desc    Delete cause
// @route   DELETE /api/causes/:id
// @access  Private
const deleteCause = async (req, res) => {
  try {
    // Check if cause exists
    const cause = await Cause.findById(req.params.id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Check ownership or admin
    if (cause.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this cause",
      });
    }

    // Delete image from ImageKit if it exists
    if (cause.imageFileId) {
      try {
        const { deleteFile } = require("../utils/imageKitService");
        await deleteFile(cause.imageFileId);
        console.log(`Deleted image with ID ${cause.imageFileId}`);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
        // Continue with the delete even if image deletion fails
      }
    }

    // Delete cause
    await Cause.delete(req.params.id);

    res.json({
      success: true,
      message: "Cause deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCause:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get cause contributions
// @route   GET /api/causes/:id/contributions
// @access  Public
const getCauseContributions = async (req, res) => {
  try {
    const contributions = await Cause.getContributions(req.params.id);

    res.json({
      success: true,
      contributions,
    });
  } catch (error) {
    console.error("Error in getCauseContributions:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get cause feedback
// @route   GET /api/causes/:id/feedback
// @access  Public
const getCauseFeedback = async (req, res) => {
  try {
    const feedback = await Cause.getFeedback(req.params.id);

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Error in getCauseFeedback:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Add contribution to cause
// @route   POST /api/causes/:id/contribute
// @access  Private
const addContribution = async (req, res) => {
  try {
    const { amount, food_quantity, message, anonymous } = req.body;
    const cause_id = req.params.id;

    // Check if cause exists
    const cause = await Cause.findById(cause_id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Validate at least one of amount or food_quantity
    if (!amount && !food_quantity) {
      return res.status(400).json({
        success: false,
        error: "Either amount or food quantity is required",
      });
    }

    // Add contribution
    const contribution = await Cause.addContribution({
      amount,
      food_quantity,
      cause_id,
      user_id: req.user.id,
      message,
      anonymous: anonymous || false,
    });

    // Notify cause creator
    await Notification.notifyCauseCreator(
      cause_id,
      "New contribution to your cause",
      `Your cause ${cause.title} received a new contribution`,
      "contribution"
    );

    // Notify followers
    await Notification.notifyCauseFollowers(
      cause_id,
      `New contribution to ${cause.title}`,
      `${cause.title} received a new contribution`,
      "contribution"
    );

    res.status(201).json({
      success: true,
      contribution,
    });
  } catch (error) {
    console.error("Error in addContribution:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Add feedback to cause
// @route   POST /api/causes/:id/feedback
// @access  Private
const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const cause_id = req.params.id;

    // Check if cause exists
    const cause = await Cause.findById(cause_id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Add feedback
    const feedback = await Cause.addFeedback({
      rating,
      comment,
      cause_id,
      user_id: req.user.id,
    });

    // Notify cause creator
    await Notification.notifyCauseCreator(
      cause_id,
      "New feedback on your cause",
      `Your cause ${cause.title} received new feedback`,
      "feedback"
    );

    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Error in addFeedback:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Follow a cause
// @route   POST /api/causes/:id/follow
// @access  Private
const followCause = async (req, res) => {
  try {
    const cause_id = req.params.id;

    // Check if cause exists
    const cause = await Cause.findById(cause_id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Check if already following
    const isFollowing = await Cause.isFollowing(req.user.id, cause_id);

    if (isFollowing) {
      return res.status(400).json({
        success: false,
        error: "Already following this cause",
      });
    } // Follow cause
    await Cause.follow(req.user.id, cause_id);

    res.json({
      success: true,
      message: "Cause followed successfully",
      isFollowing: true,
    });
  } catch (error) {
    console.error("Error in followCause:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Unfollow a cause
// @route   POST /api/causes/:id/unfollow
// @access  Private
const unfollowCause = async (req, res) => {
  try {
    const cause_id = req.params.id;

    // Check if cause exists
    const cause = await Cause.findById(cause_id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Check if following
    const isFollowing = await Cause.isFollowing(req.user.id, cause_id);

    if (!isFollowing) {
      return res.status(400).json({
        success: false,
        error: "Not following this cause",
      });
    } // Unfollow cause
    await Cause.unfollow(req.user.id, cause_id);

    res.json({
      success: true,
      message: "Cause unfollowed successfully",
      isFollowing: false,
    });
  } catch (error) {
    console.error("Error in unfollowCause:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
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
};
