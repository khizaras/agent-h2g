const { pool } = require("../config/db");

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password, avatar, bio, is_admin, google_id } =
      userData;

    try {
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password, avatar, bio, is_admin, google_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, avatar, bio, is_admin, google_id]
      );

      return { id: result.insertId, ...userData };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, email, avatar, bio, is_admin, created_at, updated_at 
         FROM users WHERE id = ?`,
        [id]
      );

      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
        email,
      ]);

      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by Google ID
  static async findByGoogleId(googleId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE google_id = ?`,
        [googleId]
      );

      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by Google ID: ${error.message}`);
    }
  }

  // Update user
  static async update(id, userData) {
    const { name, email, avatar, bio } = userData;

    try {
      await pool.query(
        `UPDATE users SET name = ?, email = ?, avatar = ?, bio = ? WHERE id = ?`,
        [name, email, avatar, bio, id]
      );

      return { id, ...userData };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Update password
  static async updatePassword(id, hashedPassword) {
    try {
      await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [
        hashedPassword,
        id,
      ]);

      return true;
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }

  // Find all users
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, email, avatar, bio, is_admin, created_at, updated_at 
         FROM users 
         ORDER BY created_at DESC`
      );

      return rows;
    } catch (error) {
      throw new Error(`Error finding all users: ${error.message}`);
    }
  }

  // Get user contributions
  static async getContributions(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT c.id, c.amount, c.food_quantity, c.message, c.anonymous, c.created_at,
          ca.id as cause_id, ca.title as cause_title, ca.image as cause_image  
         FROM contributions c
         JOIN causes ca ON c.cause_id = ca.id
         WHERE c.user_id = ?
         ORDER BY c.created_at DESC`,
        [userId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting user contributions: ${error.message}`);
    }
  }

  // Get followed causes
  static async getFollowedCauses(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT c.id, c.title, c.description, c.image, c.location, c.category, 
          c.funding_goal, c.current_funding, c.food_goal, c.current_food, c.status,
          c.created_at, c.updated_at, fc.created_at as followed_at  
         FROM followed_causes fc
         JOIN causes c ON fc.cause_id = c.id
         WHERE fc.user_id = ?
         ORDER BY fc.created_at DESC`,
        [userId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting followed causes: ${error.message}`);
    }
  }

  // Get notifications
  static async getNotifications(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT n.id, n.title, n.message, n.type, n.cause_id, n.is_read, n.created_at,
          c.title as cause_title
         FROM notifications n
         LEFT JOIN causes c ON n.cause_id = c.id
         WHERE n.user_id = ?
         ORDER BY n.created_at DESC`,
        [userId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting user notifications: ${error.message}`);
    }
  }

  // Get all users (admin)
  static async getAll() {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, email, avatar, bio, is_admin, created_at, updated_at 
         FROM users ORDER BY created_at DESC`
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting all users: ${error.message}`);
    }
  }
}

module.exports = User;
