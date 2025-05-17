const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
// Database connection pool
const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
console.log("Connecting to MySQL database with config:", mysqlConfig);

const pool = mysql.createPool(mysqlConfig);

// Connect to database
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected!");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initDB = async () => {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255),
        avatar VARCHAR(255),
        bio TEXT,
        is_admin BOOLEAN DEFAULT false,
        google_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create causes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS causes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        location VARCHAR(255) NOT NULL,
        category ENUM('local', 'emergency', 'recurring') NOT NULL,
        funding_goal DECIMAL(10, 2),
        current_funding DECIMAL(10, 2) DEFAULT 0.00,
        food_goal INT,
        current_food INT DEFAULT 0,
        status ENUM('active', 'completed', 'suspended') DEFAULT 'active',
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create contributions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(10, 2),
        food_quantity INT,
        cause_id INT NOT NULL,
        user_id INT,
        message TEXT,
        anonymous BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create feedback table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rating INT NOT NULL,
        comment TEXT,
        cause_id INT NOT NULL,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('cause_update', 'contribution', 'feedback', 'system') NOT NULL,
        cause_id INT,
        user_id INT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create followed_causes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS followed_causes (
        user_id INT NOT NULL,
        cause_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, cause_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,        FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE CASCADE
      )
    `);

    // Create activities table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
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

    console.log("All database tables initialized");
    connection.release();
  } catch (error) {
    console.error("Error initializing database tables:", error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB,
  initDB,
};
