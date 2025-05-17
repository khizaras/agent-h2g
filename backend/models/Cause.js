const { pool } = require("../config/db");

class Cause {
  // Create a new cause
  static async create(causeData) {
    const {
      title,
      description,
      image,
      location,
      category,
      funding_goal,
      food_goal,
      user_id,
    } = causeData;

    try {
      const [result] = await pool.query(
        `INSERT INTO causes (title, description, image, location, category, funding_goal, food_goal, user_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          image,
          location,
          category,
          funding_goal,
          food_goal,
          user_id,
        ]
      );

      return { id: result.insertId, ...causeData };
    } catch (error) {
      throw new Error(`Error creating cause: ${error.message}`);
    }
  }

  // Find cause by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT c.*, u.name as creator_name, u.avatar as creator_avatar 
         FROM causes c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [id]
      );

      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding cause by ID: ${error.message}`);
    }
  }

  // Update cause
  static async update(id, causeData) {
    const {
      title,
      description,
      image,
      location,
      category,
      funding_goal,
      food_goal,
      status,
    } = causeData;

    try {
      await pool.query(
        `UPDATE causes SET 
         title = ?, description = ?, image = ?, location = ?, 
         category = ?, funding_goal = ?, food_goal = ?, status = ?
         WHERE id = ?`,
        [
          title,
          description,
          image,
          location,
          category,
          funding_goal,
          food_goal,
          status,
          id,
        ]
      );

      return { id, ...causeData };
    } catch (error) {
      throw new Error(`Error updating cause: ${error.message}`);
    }
  }

  // Get all causes with filters
  static async getAll(filters = {}) {
    const {
      category,
      location,
      status,
      search,
      limit = 10,
      page = 1,
    } = filters;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Start building the query
    let query = `
      SELECT c.*, u.name as creator_name, u.avatar as creator_avatar,
      (SELECT COUNT(*) FROM contributions WHERE cause_id = c.id) as contribution_count 
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;

    const queryParams = [];

    // Add filters if provided
    if (category) {
      query += ` AND c.category = ?`;
      queryParams.push(category);
    }

    if (location) {
      query += ` AND c.location LIKE ?`;
      queryParams.push(`%${location}%`);
    }

    if (status) {
      query += ` AND c.status = ?`;
      queryParams.push(status);
    }

    if (search) {
      query += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add ordering
    query += ` ORDER BY c.created_at DESC`;

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    try {
      // Get paginated results
      const [rows] = await pool.query(query, queryParams);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total FROM causes c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE 1=1
      `;

      let countQueryParams = [];

      // Add the same filters to count query
      if (category) {
        countQuery += ` AND c.category = ?`;
        countQueryParams.push(category);
      }

      if (location) {
        countQuery += ` AND c.location LIKE ?`;
        countQueryParams.push(`%${location}%`);
      }

      if (status) {
        countQuery += ` AND c.status = ?`;
        countQueryParams.push(status);
      }

      if (search) {
        countQuery += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
        countQueryParams.push(`%${search}%`, `%${search}%`);
      }

      const [countResult] = await pool.query(countQuery, countQueryParams);
      const total = countResult[0]?.total || 0;

      return {
        causes: rows,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error getting causes: ${error.message}`);
    }
  }

  // Get cause contributions
  static async getContributions(causeId) {
    try {
      const [rows] = await pool.query(
        `SELECT c.id, c.amount, c.food_quantity, c.message, c.anonymous, c.created_at,
          u.id as user_id, u.name as user_name, u.avatar as user_avatar
         FROM contributions c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.cause_id = ?
         ORDER BY c.created_at DESC`,
        [causeId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting cause contributions: ${error.message}`);
    }
  }

  // Get cause feedback/ratings
  static async getFeedback(causeId) {
    try {
      const [rows] = await pool.query(
        `SELECT f.id, f.rating, f.comment, f.created_at,
          u.id as user_id, u.name as user_name, u.avatar as user_avatar
         FROM feedback f
         LEFT JOIN users u ON f.user_id = u.id
         WHERE f.cause_id = ?
         ORDER BY f.created_at DESC`,
        [causeId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting cause feedback: ${error.message}`);
    }
  }

  // Add contribution
  static async addContribution(contributionData) {
    const { amount, food_quantity, cause_id, user_id, message, anonymous } =
      contributionData;

    try {
      // Start a transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Add the contribution
        const [result] = await connection.query(
          `INSERT INTO contributions (amount, food_quantity, cause_id, user_id, message, anonymous) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [amount, food_quantity, cause_id, user_id, message, anonymous]
        );

        // Update the cause totals
        if (amount) {
          await connection.query(
            `UPDATE causes SET current_funding = current_funding + ? WHERE id = ?`,
            [amount, cause_id]
          );
        }

        if (food_quantity) {
          await connection.query(
            `UPDATE causes SET current_food = current_food + ? WHERE id = ?`,
            [food_quantity, cause_id]
          );
        }

        // Commit the transaction
        await connection.commit();

        return { id: result.insertId, ...contributionData };
      } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw new Error(`Error adding contribution: ${error.message}`);
    }
  }

  // Add feedback/rating
  static async addFeedback(feedbackData) {
    const { rating, comment, cause_id, user_id } = feedbackData;

    try {
      const [result] = await pool.query(
        `INSERT INTO feedback (rating, comment, cause_id, user_id) 
         VALUES (?, ?, ?, ?)`,
        [rating, comment, cause_id, user_id]
      );

      return { id: result.insertId, ...feedbackData };
    } catch (error) {
      throw new Error(`Error adding feedback: ${error.message}`);
    }
  }

  // Follow a cause
  static async follow(userId, causeId) {
    try {
      await pool.query(
        `INSERT INTO followed_causes (user_id, cause_id) 
         VALUES (?, ?)`,
        [userId, causeId]
      );

      return true;
    } catch (error) {
      throw new Error(`Error following cause: ${error.message}`);
    }
  }

  // Unfollow a cause
  static async unfollow(userId, causeId) {
    try {
      await pool.query(
        `DELETE FROM followed_causes 
         WHERE user_id = ? AND cause_id = ?`,
        [userId, causeId]
      );

      return true;
    } catch (error) {
      throw new Error(`Error unfollowing cause: ${error.message}`);
    }
  }

  // Check if user is following a cause
  static async isFollowing(userId, causeId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM followed_causes 
         WHERE user_id = ? AND cause_id = ?`,
        [userId, causeId]
      );

      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking if following cause: ${error.message}`);
    }
  }

  // Delete a cause
  static async delete(id) {
    try {
      await pool.query("DELETE FROM causes WHERE id = ?", [id]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting cause: ${error.message}`);
    }
  }
}

module.exports = Cause;
