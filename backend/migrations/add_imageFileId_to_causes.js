const { pool } = require("../config/db");

async function addImageFileIdToCauses() {
  try {
    console.log("Adding imageFileId column to causes table...");

    await pool.query(`
      ALTER TABLE causes
      ADD COLUMN imageFileId VARCHAR(255) NULL
      AFTER image
    `);

    console.log("Successfully added imageFileId column to causes table.");
    process.exit(0);
  } catch (error) {
    console.error("Error adding imageFileId column:", error);
    process.exit(1);
  }
}

addImageFileIdToCauses();
