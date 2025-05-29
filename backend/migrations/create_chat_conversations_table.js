const { pool } = require("../config/db");

/**
 * This migration creates the chat_conversations table to store chat history
 */
async function up() {
  try {
    // Create the chat_conversations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Add index for faster queries
    await pool.query(`
      CREATE INDEX idx_chat_user_id ON chat_conversations(user_id);
      CREATE INDEX idx_chat_session_id ON chat_conversations(session_id);
      CREATE INDEX idx_chat_created_at ON chat_conversations(created_at);
    `);

    console.log("✅ chat_conversations table created successfully");
    return true;
  } catch (error) {
    console.error("❌ Error creating chat_conversations table:", error);
    throw error;
  }
}

/**
 * This function drops the chat_conversations table
 */
async function down() {
  try {
    await pool.query("DROP TABLE IF EXISTS chat_conversations");
    console.log("✅ chat_conversations table dropped successfully");
    return true;
  } catch (error) {
    console.error("❌ Error dropping chat_conversations table:", error);
    throw error;
  }
}

module.exports = { up, down };
