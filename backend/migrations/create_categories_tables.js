const { pool } = require("../config/db");
require("dotenv").config();
const createCategoriesTables = async () => {
  console.log("Creating categories tables...");
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
    console.log("Category_fields table created");

    // Create cause_category_values table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cause_category_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cause_id INT NOT NULL,
        category_id INT NOT NULL,
        field_id INT NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (field_id) REFERENCES category_fields(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cause_field (cause_id, field_id)
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
        ADD COLUMN category_id INT,
        ADD CONSTRAINT fk_cause_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      `);
      console.log("Added category_id column to causes table");
    }

    await connection.commit();
    console.log("All categories tables created successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Error creating categories tables:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Run the migration
createCategoriesTables()
  .then(() => console.log("Categories tables migration completed"))
  .catch((err) => console.error("Migration failed:", err))
  .finally(() => process.exit());
