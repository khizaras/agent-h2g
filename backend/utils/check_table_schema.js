require("dotenv").config();
const { pool } = require("../config/db");

async function checkTableSchema() {
  try {
    console.log("Checking causes table schema...");

    // Get the current schema of the causes table
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'causes'
      ORDER BY ORDINAL_POSITION
    `);

    console.log("Causes Table Schema:");
    console.log("----------------------------------------");

    columns.forEach((column) => {
      console.log(
        `${column.COLUMN_NAME} (${column.DATA_TYPE}${
          column.CHARACTER_MAXIMUM_LENGTH
            ? `(${column.CHARACTER_MAXIMUM_LENGTH})`
            : ""
        }, ${column.IS_NULLABLE === "YES" ? "NULL" : "NOT NULL"})`
      );
    });

    console.log("----------------------------------------");

    // Check if imageFileId column exists
    const imageFileIdColumn = columns.find(
      (col) => col.COLUMN_NAME === "imageFileId"
    );
    if (imageFileIdColumn) {
      console.log("✅ The imageFileId column exists in the causes table.");
    } else {
      console.log(
        "❌ The imageFileId column does NOT exist in the causes table."
      );
      console.log(
        "Run the migration script: node backend/migrations/add_imageFileId_to_causes.js"
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking table schema:", error);
    process.exit(1);
  }
}

checkTableSchema();
