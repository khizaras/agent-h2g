const { pool } = require("../config/db");

class ChatConversation {
  // Create a new chat message
  static async create(messageData) {
    const { user_id, message, response, session_id } = messageData;

    try {
      const [result] = await pool.query(
        `INSERT INTO chat_conversations (user_id, message, response, session_id, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [user_id, message, response, session_id]
      );

      return { id: result.insertId, ...messageData };
    } catch (error) {
      throw new Error(`Error saving chat message: ${error.message}`);
    }
  }

  // Get user's chat count for today
  static async getUserDailyCount(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM chat_conversations 
         WHERE user_id = ? 
         AND DATE(created_at) = CURDATE()`,
        [userId]
      );

      return rows[0].count || 0;
    } catch (error) {
      throw new Error(`Error counting user chats: ${error.message}`);
    }
  }

  // Get all chat history for a user
  static async getByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM chat_conversations 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [userId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error fetching user chat history: ${error.message}`);
    }
  }

  // Get conversations grouped by session_id (for a specific user)
  static async getUserConversationsBySession(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT session_id, MIN(created_at) as start_time, COUNT(*) as message_count 
         FROM chat_conversations 
         WHERE user_id = ? 
         GROUP BY session_id 
         ORDER BY start_time DESC`,
        [userId]
      );

      return rows;
    } catch (error) {
      throw new Error(
        `Error fetching user conversation sessions: ${error.message}`
      );
    }
  }

  // Get messages for a specific session
  static async getSessionMessages(sessionId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM chat_conversations 
         WHERE session_id = ? 
         ORDER BY created_at ASC`,
        [sessionId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error fetching session messages: ${error.message}`);
    }
  }

  // Get all conversations for admin dashboard
  static async getAllConversations(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    try {
      const [rows] = await pool.query(
        `SELECT c.*, u.name as user_name, u.email as user_email
         FROM chat_conversations c
         JOIN users u ON c.user_id = u.id
         ORDER BY c.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [countResult] = await pool.query(
        `SELECT COUNT(DISTINCT session_id) as total FROM chat_conversations`
      );

      return {
        conversations: rows,
        totalSessions: countResult[0].total,
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching all conversations: ${error.message}`);
    }
  }

  // Get all conversations grouped by session for admin dashboard
  static async getAllSessionsWithDetails(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    try {
      const [rows] = await pool.query(
        `SELECT 
          c.session_id, 
          MIN(c.created_at) as start_time,
          MAX(c.created_at) as last_message_time, 
          COUNT(*) as message_count,
          u.id as user_id,
          u.name as user_name,
          u.email as user_email,
          (SELECT message FROM chat_conversations WHERE session_id = c.session_id ORDER BY created_at ASC LIMIT 1) as first_message
         FROM chat_conversations c
         JOIN users u ON c.user_id = u.id
         GROUP BY c.session_id, u.id, u.name, u.email
         ORDER BY start_time DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [countResult] = await pool.query(
        `SELECT COUNT(DISTINCT session_id) as total FROM chat_conversations`
      );

      return {
        sessions: rows,
        total: countResult[0].total,
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching conversation sessions: ${error.message}`);
    }
  }

  // Get extended user chat statistics with detailed analytics
  static async getUserStats(userId) {
    try {
      const [totalMessages] = await pool.query(
        `SELECT COUNT(*) as total FROM chat_conversations WHERE user_id = ?`,
        [userId]
      );

      const [sessionStats] = await pool.query(
        `SELECT 
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(*) / COUNT(DISTINCT session_id) as avg_messages_per_session,
          MAX(created_at) as last_activity,
          MIN(created_at) as first_activity,
          AVG(CHAR_LENGTH(message)) as avg_message_length,
          MAX(CHAR_LENGTH(message)) as max_message_length
        FROM chat_conversations 
        WHERE user_id = ?`,
        [userId]
      );

      const [timeDistribution] = await pool.query(
        `SELECT 
          HOUR(created_at) as hour,
          COUNT(*) as message_count
        FROM chat_conversations 
        WHERE user_id = ?
        GROUP BY HOUR(created_at)
        ORDER BY hour`,
        [userId]
      );

      // Get response time analytics
      const [responseTimeStats] = await pool.query(
        `SELECT 
          AVG(TIMESTAMPDIFF(SECOND, c1.created_at, c2.created_at)) as avg_response_time,
          MIN(TIMESTAMPDIFF(SECOND, c1.created_at, c2.created_at)) as min_response_time,
          MAX(TIMESTAMPDIFF(SECOND, c1.created_at, c2.created_at)) as max_response_time
        FROM chat_conversations c1
        JOIN chat_conversations c2 ON c1.session_id = c2.session_id 
          AND c1.user_id = ? 
          AND c2.created_at > c1.created_at
        WHERE TIMESTAMPDIFF(SECOND, c1.created_at, c2.created_at) < 3600`, // Exclude gaps > 1 hour
        [userId]
      );

      // Get daily activity pattern
      const [dailyActivity] = await pool.query(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as message_count
        FROM chat_conversations 
        WHERE user_id = ?
          AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC`,
        [userId]
      );

      return {
        totalMessages: totalMessages[0].total,
        ...sessionStats[0],
        timeDistribution,
        responseTimeStats: responseTimeStats[0],
        dailyActivity,
        avgMessageLength: Math.round(sessionStats[0].avg_message_length),
        maxMessageLength: sessionStats[0].max_message_length,
      };
    } catch (error) {
      throw new Error(`Error getting user statistics: ${error.message}`);
    }
  }

  // Get platform-wide chat statistics with enhanced analytics
  static async getPlatformStats() {
    try {
      const [generalStats] = await pool.query(
        `SELECT 
          COUNT(*) as total_messages,
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(DISTINCT user_id) as total_users,
          COUNT(*) / COUNT(DISTINCT session_id) as avg_messages_per_session,
          AVG(CHAR_LENGTH(message)) as avg_message_length
        FROM chat_conversations`
      );

      const [activeToday] = await pool.query(
        `SELECT 
          COUNT(DISTINCT user_id) as active_users_today,
          COUNT(*) as messages_today
        FROM chat_conversations 
        WHERE DATE(created_at) = CURDATE()`
      );

      const [topUsers] = await pool.query(
        `SELECT 
          c.user_id,
          u.name as user_name,
          COUNT(*) as message_count,
          COUNT(DISTINCT c.session_id) as session_count,
          AVG(CHAR_LENGTH(c.message)) as avg_message_length
        FROM chat_conversations c
        JOIN users u ON c.user_id = u.id
        GROUP BY c.user_id, u.name
        ORDER BY message_count DESC
        LIMIT 10`
      );

      const [hourlyDistribution] = await pool.query(
        `SELECT 
          HOUR(created_at) as hour,
          COUNT(*) as message_count,
          COUNT(DISTINCT user_id) as unique_users
        FROM chat_conversations 
        GROUP BY HOUR(created_at)
        ORDER BY hour`
      );

      const [dailyStats] = await pool.query(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as message_count,
          COUNT(DISTINCT user_id) as active_users,
          COUNT(DISTINCT session_id) as sessions_count
        FROM chat_conversations 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC`
      );

      // Calculate platform growth stats
      const [growthStats] = await pool.query(
        `SELECT
          WEEK(created_at) as week,
          YEAR(created_at) as year,
          COUNT(DISTINCT user_id) as new_users,
          COUNT(*) as messages
        FROM chat_conversations
        GROUP BY WEEK(created_at), YEAR(created_at)
        ORDER BY year DESC, week DESC
        LIMIT 12`
      );

      return {
        ...generalStats[0],
        active_users_today: activeToday[0].active_users_today,
        messages_today: activeToday[0].messages_today,
        top_users: topUsers,
        hourly_distribution: hourlyDistribution,
        daily_stats: dailyStats,
        growth_stats: growthStats,
      };
    } catch (error) {
      throw new Error(`Error getting platform statistics: ${error.message}`);
    }
  }

  // Get detailed session analytics
  static async getSessionAnalytics(sessionId) {
    try {
      const [sessionStats] = await pool.query(
        `SELECT 
          MIN(created_at) as start_time,
          MAX(created_at) as end_time,
          TIMESTAMPDIFF(MINUTE, MIN(created_at), MAX(created_at)) as duration_minutes,
          COUNT(*) as message_count,
          user_id,
          AVG(CHAR_LENGTH(message)) as avg_message_length,
          MAX(CHAR_LENGTH(message)) as max_message_length
        FROM chat_conversations 
        WHERE session_id = ?
        GROUP BY session_id, user_id`,
        [sessionId]
      );

      if (sessionStats.length === 0) {
        throw new Error("Session not found");
      }

      // Get message sequence with timing analysis
      const [messages] = await pool.query(
        `SELECT 
          message,
          response,
          created_at,
          CHAR_LENGTH(message) as message_length,
          CHAR_LENGTH(response) as response_length,
          @prev_time := @curr_time as prev_time,
          @curr_time := created_at as curr_time,
          CASE 
            WHEN @prev_time IS NOT NULL 
            THEN TIMESTAMPDIFF(SECOND, @prev_time, created_at)
            ELSE NULL 
          END as time_since_last_message
        FROM chat_conversations,
        (SELECT @curr_time := NULL, @prev_time := NULL) as vars
        WHERE session_id = ?
        ORDER BY created_at ASC`,
        [sessionId]
      );

      // Calculate message timing patterns
      const messageTimings = messages.filter(
        (m) => m.time_since_last_message != null
      );
      const avgTimeBetweenMessages =
        messageTimings.length > 0
          ? messageTimings.reduce(
              (sum, m) => sum + m.time_since_last_message,
              0
            ) / messageTimings.length
          : 0;

      return {
        ...sessionStats[0],
        messages,
        timing_analysis: {
          avg_time_between_messages: Math.round(avgTimeBetweenMessages),
          message_timings: messageTimings.map((m) => ({
            timestamp: m.created_at,
            gap_seconds: m.time_since_last_message,
          })),
        },
      };
    } catch (error) {
      throw new Error(`Error getting session analytics: ${error.message}`);
    }
  }
}

module.exports = ChatConversation;
