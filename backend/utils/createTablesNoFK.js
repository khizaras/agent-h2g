const mysql = require("mysql2/promise");
require("dotenv").config();

async function createCategoriesTables() {
  // Use environment variables if available, otherwise use defaults
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hands2gether_db",
  });

  try {
    console.log("Creating categories tables...");

    // Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Categories table created");

    // Create category_fields table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS category_fields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        type ENUM('text', 'textarea', 'number', 'date', 'select', 'checkbox', 'radio', 'file') NOT NULL,
        required BOOLEAN DEFAULT false,
        options JSON,
        placeholder VARCHAR(255),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Category_fields table created");

    // Create cause_category_values table without foreign keys
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cause_category_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cause_id INT NOT NULL,
        category_id INT NOT NULL,
        field_id INT NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Cause_category_values table created");

    // Update causes table to add category_id reference (if not exists)
    // First check if column exists
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM causes LIKE 'category_id'
    `);

    // If category_id column doesn't exist, add it
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE causes 
        ADD COLUMN category_id INT
      `);
      console.log("Added category_id column to causes table");
    }

    // Seed some initial categories
    await connection.query(`
      INSERT INTO categories (name, description, created_at, updated_at)
      VALUES 
        ('Local', 'Local causes', NOW(), NOW()),
        ('Emergency', 'Emergency causes', NOW(), NOW()),
        ('Recurring', 'Recurring causes', NOW(), NOW())
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    console.log("Categories seeded");

    console.log("All categories tables created successfully");
  } catch (error) {
    console.error("Error creating categories tables:", error);
  } finally {
    await connection.end();
  }
}

// Run the migration
createCategoriesTables()
  .then(() => console.log("Categories tables migration completed"))
  .catch((err) => console.error("Migration failed:", err))
  .finally(() => process.exit(0));
