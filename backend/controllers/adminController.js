const { pool } = require("../config/db");
const User = require("../models/User");
const Cause = require("../models/Cause");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    // Get user count
    const [userCountResult] = await pool.query(
      "SELECT COUNT(*) as count FROM users"
    );
    const userCount = userCountResult[0].count;

    // Get cause count
    const [causeCountResult] = await pool.query(
      "SELECT COUNT(*) as count FROM causes"
    );
    const causeCount = causeCountResult[0].count;

    // Get active cause count
    const [activeCauseCountResult] = await pool.query(
      "SELECT COUNT(*) as count FROM causes WHERE status = 'active'"
    );
    const activeCauseCount = activeCauseCountResult[0].count;

    // Get contribution count
    const [contributionCountResult] = await pool.query(
      "SELECT COUNT(*) as count FROM contributions"
    );
    const contributionCount = contributionCountResult[0].count; // Get total money contributions
    const [moneyResult] = await pool.query(
      "SELECT SUM(amount) as total FROM contributions WHERE amount > 0"
    );
    const totalMoney = moneyResult[0].total || 0;
    // Get total food contributions
    const [foodResult] = await pool.query(
      "SELECT SUM(food_quantity) as total FROM contributions WHERE food_quantity > 0"
    );
    const totalFood = foodResult[0].total || 0;

    // Get cause categories distribution
    const [categoriesDistribution] = await pool.query(
      "SELECT category, COUNT(*) as count FROM causes GROUP BY category"
    );

    // Format the stats in the structure expected by the frontend
    res.json({
      users: {
        total: userCount,
        change: 5, // Placeholder for growth calculation
      },
      causes: {
        total: causeCount,
        active: activeCauseCount,
      },
      money: {
        total: totalMoney,
        change: 3, // Placeholder for growth calculation
      },
      food: {
        total: totalFood,
        change: 7, // Placeholder for growth calculation
      },
      contributionsChart: {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        money: [1000, 1500, 2000, 2200, 2700, 3000],
        food: [50, 75, 100, 110, 135, 150],
      },
      causesByCategory: {
        local: 40,
        emergency: 35,
        recurring: 25,
      },
    });
  } catch (error) {
    console.error("Error in getStats:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Toggle user admin status
// @route   PUT /api/admin/users/:id/toggle-admin
// @access  Private/Admin
const toggleAdminStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get current user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Toggle admin status
    const [result] = await pool.query(
      "UPDATE users SET is_admin = NOT is_admin WHERE id = ?",
      [userId]
    );

    if (result.affectedRows > 0) {
      const updatedUser = await User.findById(userId);

      res.json({
        success: true,
        user: updatedUser,
        message: `User admin status ${
          updatedUser.is_admin ? "enabled" : "disabled"
        }`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to update user admin status",
      });
    }
  } catch (error) {
    console.error("Error in toggleAdminStatus:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Moderate cause (approve/suspend)
// @route   PUT /api/admin/causes/:id/moderate
// @access  Private/Admin
const moderateCause = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["active", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "active" or "suspended"',
      });
    }

    // Check if cause exists
    const cause = await Cause.findById(req.params.id);

    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Update cause status
    const updatedCause = await Cause.update(req.params.id, {
      ...cause,
      status,
    });

    // Notify cause owner and followers about status change
    const statusMessage = status === "active" ? "approved" : "suspended";

    await Notification.notifyCauseCreator(
      cause.id,
      `Your cause has been ${statusMessage}`,
      `Your cause "${cause.title}" has been ${statusMessage} by an administrator.`,
      "system"
    );

    await Notification.notifyCauseFollowers(
      cause.id,
      `Cause status updated: ${cause.title}`,
      `The cause "${cause.title}" has been ${statusMessage} by an administrator.`,
      "system"
    );

    res.json({
      success: true,
      cause: updatedCause,
      message: `Cause ${statusMessage} successfully`,
    });
  } catch (error) {
    console.error("Error in moderateCause:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return res.status(404).json({
        success: false,
        error: "No users found",
      });
    }

    // Map users to remove sensitive information
    const sanitizedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      is_admin: user.is_admin ? true : false,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    res.json({
      success: true,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { name, email, password, is_admin } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      is_admin: is_admin ? 1 : 0,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error in createUser:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, is_admin } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update user
    const updatedUser = await User.update(userId, {
      ...user,
      name: name || user.name,
      email: email || user.email,
      is_admin: is_admin !== undefined ? (is_admin ? 1 : 0) : user.is_admin,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Delete user
    await User.remove(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
      id: userId,
    });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get all causes for admin
// @route   GET /api/admin/causes
// @access  Private/Admin
const getAllCauses = async (req, res) => {
  try {
    // Get all causes with additional details
    const causes = await Cause.findAll();
    res.json(causes);
  } catch (error) {
    console.error("Error in getAllCauses:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update cause status
// @route   PATCH /api/admin/causes/:id/status
// @access  Private/Admin
const updateCauseStatus = async (req, res) => {
  try {
    const causeId = req.params.id;
    const { status } = req.body;

    if (!status || !["active", "completed", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "active", "completed", or "suspended"',
      });
    }

    // Check if cause exists
    const cause = await Cause.findById(causeId);
    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Update cause status
    const updatedCause = await Cause.update(causeId, {
      ...cause,
      status,
    });

    res.json(updatedCause);
  } catch (error) {
    console.error("Error in updateCauseStatus:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Delete a cause
// @route   DELETE /api/admin/causes/:id
// @access  Private/Admin
const deleteCause = async (req, res) => {
  try {
    const causeId = req.params.id;

    // Check if cause exists
    const cause = await Cause.findById(causeId);
    if (!cause) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    // Delete cause
    await Cause.remove(causeId);

    res.json({
      success: true,
      message: "Cause deleted successfully",
      id: causeId,
    });
  } catch (error) {
    console.error("Error in deleteCause:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get admin activities
// @route   GET /api/admin/activities
// @access  Private/Admin
const getActivities = async (req, res) => {
  try {
    const { startDate, endDate, type = "all" } = req.query;

    // Use the Activity model instead of direct SQL
    const activities = await Activity.findAll({
      startDate,
      endDate,
      type,
      limit: 100,
    });

    res.json(activities);
  } catch (error) {
    console.error("Error in getActivities:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
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
};
