const { pool } = require("../config/db");

class Notification {
  // Create a new notification
  static async create(notificationData) {
    const { title, message, type, cause_id, user_id } = notificationData;

    try {
      const [result] = await pool.query(
        `INSERT INTO notifications (title, message, type, cause_id, user_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, message, type, cause_id, user_id]
      );

      return { id: result.insertId, ...notificationData };
    } catch (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }
  }

  // Mark notification as read
  static async markAsRead(id) {
    try {
      await pool.query(`UPDATE notifications SET is_read = true WHERE id = ?`, [
        id,
      ]);

      return true;
    } catch (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      await pool.query(
        `UPDATE notifications SET is_read = true WHERE user_id = ?`,
        [userId]
      );

      return true;
    } catch (error) {
      throw new Error(
        `Error marking all notifications as read: ${error.message}`
      );
    }
  }

  // Get unread notifications count
  static async getUnreadCount(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM notifications 
         WHERE user_id = ? AND is_read = false`,
        [userId]
      );

      return rows[0].count;
    } catch (error) {
      throw new Error(
        `Error getting unread notifications count: ${error.message}`
      );
    }
  }

  // Create notifications for cause followers
  static async notifyCauseFollowers(causeId, title, message, type) {
    try {
      // Get all users following the cause
      const [followers] = await pool.query(
        `SELECT user_id FROM followed_causes WHERE cause_id = ?`,
        [causeId]
      );

      if (followers.length === 0) {
        return [];
      }

      // Create notifications for each follower
      const notifications = [];

      for (const follower of followers) {
        const notificationData = {
          title,
          message,
          type,
          cause_id: causeId,
          user_id: follower.user_id,
        };

        const notification = await this.create(notificationData);
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      throw new Error(`Error notifying cause followers: ${error.message}`);
    }
  }

  // Create notification for cause creator
  static async notifyCauseCreator(causeId, title, message, type) {
    try {
      // Get the cause creator
      const [rows] = await pool.query(
        `SELECT user_id FROM causes WHERE id = ?`,
        [causeId]
      );

      if (rows.length === 0 || !rows[0].user_id) {
        return null;
      }

      const userId = rows[0].user_id;

      // Create notification for the creator
      const notificationData = {
        title,
        message,
        type,
        cause_id: causeId,
        user_id: userId,
      };

      return await this.create(notificationData);
    } catch (error) {
      throw new Error(`Error notifying cause creator: ${error.message}`);
    }
  }

  // Create administrative notification for all users
  static async createAdminNotification(title, message) {
    try {
      // Get all users
      const [users] = await pool.query(`SELECT id FROM users`);

      if (users.length === 0) {
        return [];
      }

      // Create notifications for all users
      const notifications = [];
      const type = "admin";

      for (const user of users) {
        const notificationData = {
          title,
          message,
          type,
          cause_id: null,
          user_id: user.id,
        };

        const notification = await this.create(notificationData);
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      throw new Error(`Error creating admin notification: ${error.message}`);
    }
  }

  // Create milestone notification for a cause
  static async createMilestoneNotification(causeId, title, message, milestone) {
    try {
      // Create notification data with milestone information
      const notificationData = {
        title,
        message,
        type: "milestone",
        cause_id: causeId,
        metadata: JSON.stringify({ milestone }),
      };

      // First notify the cause creator
      const creatorNotification = await this.notifyCauseCreator(
        causeId,
        title,
        message,
        "milestone"
      );

      // Then notify all followers
      const followerNotifications = await this.notifyCauseFollowers(
        causeId,
        title,
        message,
        "milestone"
      );

      return {
        creatorNotification,
        followerNotifications,
      };
    } catch (error) {
      throw new Error(
        `Error creating milestone notification: ${error.message}`
      );
    }
  }

  // Create deadline approaching notification
  static async createDeadlineNotification(causeId, daysRemaining) {
    try {
      const title = `Deadline Approaching for Cause`;
      const message = `Your cause has ${daysRemaining} days remaining to reach its goal.`;

      // Notify only the cause creator
      return await this.notifyCauseCreator(causeId, title, message, "deadline");
    } catch (error) {
      throw new Error(`Error creating deadline notification: ${error.message}`);
    }
  }

  // Create feedback notification
  static async createFeedbackNotification(
    causeId,
    feedbackId,
    userWhoGaveFeedback
  ) {
    try {
      const title = `New Feedback Received`;
      const message = `${userWhoGaveFeedback} has provided feedback on your cause.`;

      // Notify only the cause creator
      return await this.notifyCauseCreator(causeId, title, message, "feedback");
    } catch (error) {
      throw new Error(`Error creating feedback notification: ${error.message}`);
    }
  }

  // Create contribution thank you notification
  static async createThankYouNotification(
    causeId,
    contributorId,
    contributionAmount
  ) {
    try {
      // Get the cause details
      const [causeRows] = await pool.query(
        `SELECT title FROM causes WHERE id = ?`,
        [causeId]
      );

      if (causeRows.length === 0) {
        throw new Error("Cause not found");
      }

      const causeTitle = causeRows[0].title;
      const title = `Thank You for Your Contribution`;
      const message = `Thank you for contributing ${contributionAmount} to "${causeTitle}". Your generosity is making a difference!`;

      // Create notification for the contributor
      const notificationData = {
        title,
        message,
        type: "thank_you",
        cause_id: causeId,
        user_id: contributorId,
      };

      return await this.create(notificationData);
    } catch (error) {
      throw new Error(
        `Error creating thank you notification: ${error.message}`
      );
    }
  }
}

module.exports = Notification;
