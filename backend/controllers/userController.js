const User = require("../models/User");
const { upload } = require("../middleware/uploadMiddleware");

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const userId = req.user.id;

    // Check if email already exists
    if (email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already in use",
        });
      }
    }

    // Get avatar from file or keep existing
    let avatar = req.user.avatar;
    if (req.file) {
      // Using relative path for storing in DB
      avatar = `/uploads/${req.file.filename}`;
    }

    // Update user
    const updatedUser = await User.update(userId, {
      name,
      email,
      avatar,
      bio,
    });

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get user contributions
// @route   GET /api/users/contributions
// @access  Private
const getUserContributions = async (req, res) => {
  try {
    const contributions = await User.getContributions(req.user.id);

    res.json({
      success: true,
      contributions,
    });
  } catch (error) {
    console.error("Error in getUserContributions:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get user followed causes
// @route   GET /api/users/followed-causes
// @access  Private
const getFollowedCauses = async (req, res) => {
  try {
    const causes = await User.getFollowedCauses(req.user.id);

    res.json({
      success: true,
      causes,
    });
  } catch (error) {
    console.error("Error in getFollowedCauses:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await User.getNotifications(req.user.id);

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
  } catch (error) {
    console.error("Error in getUserById:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  updateProfile,
  getUserContributions,
  getFollowedCauses,
  getNotifications,
  getAllUsers,
  getUserById,
};
