const Notification = require("../models/Notification");

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id);

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error in markAsRead:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error in markAllAsRead:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in getUnreadCount:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get notifications
    const [notifications] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), offset]
    );

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM notifications WHERE user_id = ?`,
      [req.user.id]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getUserNotifications:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Create admin notification for all users
// @route   POST /api/notifications/admin
// @access  Admin
const createAdminNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide title and message",
      });
    }

    const notifications = await Notification.createAdminNotification(
      title,
      message
    );

    res.status(201).json({
      success: true,
      count: notifications.length,
      message: "Admin notification sent to all users",
    });
  } catch (error) {
    console.error("Error in createAdminNotification:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Create milestone notification for a cause
// @route   POST /api/notifications/milestone/:causeId
// @access  Private (Cause owner)
const createMilestoneNotification = async (req, res) => {
  try {
    const { title, message, milestone } = req.body;
    const { causeId } = req.params;

    if (!title || !message || !milestone) {
      return res.status(400).json({
        success: false,
        error: "Please provide title, message, and milestone",
      });
    }

    // Verify user is the cause owner
    const [cause] = await pool.query(
      `SELECT user_id FROM causes WHERE id = ?`,
      [causeId]
    );

    if (cause.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cause not found",
      });
    }

    if (cause[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error:
          "Not authorized to create milestone notifications for this cause",
      });
    }

    const result = await Notification.createMilestoneNotification(
      causeId,
      title,
      message,
      milestone
    );

    res.status(201).json({
      success: true,
      result,
      message: "Milestone notification created successfully",
    });
  } catch (error) {
    console.error("Error in createMilestoneNotification:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getUserNotifications,
  createAdminNotification,
  createMilestoneNotification,
};
