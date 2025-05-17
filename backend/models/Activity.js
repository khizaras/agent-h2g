const { pool } = require("../config/db");

class Activity {
  static async findAll(options = {}) {
    try {
      const { startDate, endDate, type, limit = 100 } = options;

      let query = `
        SELECT a.*, u.name as user_name
        FROM activities a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE 1=1
      `;

      const params = [];

      if (startDate) {
        query += " AND a.created_at >= ?";
        params.push(startDate);
      }

      if (endDate) {
        query += " AND a.created_at <= ?";
        params.push(endDate);
      }

      if (type && type !== "all") {
        query += " AND a.type = ?";
        params.push(type);
      }

      query += " ORDER BY a.created_at DESC LIMIT ?";
      params.push(parseInt(limit));

      const [activities] = await pool.query(query, params);
      return activities;
    } catch (error) {
      console.error("Error finding activities:", error.message);
      throw error;
    }
  }

  static async create(activityData) {
    try {
      const { user_id, type, details, cause_id = null } = activityData;
      const [result] = await pool.query(
        "INSERT INTO activities (user_id, type, details, cause_id) VALUES (?, ?, ?, ?)",
        [user_id, type, details, cause_id]
      );

      return { id: result.insertId, ...activityData, created_at: new Date() };
    } catch (error) {
      console.error("Error creating activity:", error.message);
      throw error;
    }
  }

  static async seedTable() {
    try {
      // Check if the table exists
      const [tables] = await pool.query("SHOW TABLES LIKE 'activities'");

      if (tables.length === 0) {
        // Create the table
        await pool.query(`
          CREATE TABLE activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            type VARCHAR(50) NOT NULL,
            details TEXT,
            cause_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE SET NULL
          )
        `);
        console.log("Activities table created");

        // Insert some initial sample data
        const sampleActivities = [
          {
            user_id: 1,
            type: "user_registered",
            details: "New user registered",
            cause_id: null,
          },
          {
            user_id: 1,
            type: "cause_created",
            details: 'Created new cause "Local Food Drive"',
            cause_id: 1,
          },
          {
            user_id: 2,
            type: "contribution",
            details: 'Contributed $50 to "Local Food Drive"',
            cause_id: 1,
          },
          {
            user_id: 3,
            type: "feedback",
            details: "Provided feedback on the platform",
            cause_id: null,
          },
        ];

        for (const activity of sampleActivities) {
          await Activity.create(activity);
        }

        console.log("Sample activities added");
      }
    } catch (error) {
      console.error("Error setting up activities table:", error.message);
      throw error;
    }
  }
}

module.exports = Activity;
