require("dotenv").config();
const { pool } = require("../config/db");

async function testImageFileIdUpdate() {
  let connection;
  try {
    console.log("Testing imageFileId column update...");
    console.log("Database config:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    // Get a direct connection to the database
    connection = await pool.getConnection();
    console.log("Successfully connected to the database");

    // Try to update a cause with just the imageFileId to isolate the issue
    const testCauseId = 1; // Use a cause ID that exists in your database
    const testFileId = "test-file-id-" + Date.now();

    console.log(
      `Updating cause ID ${testCauseId} with imageFileId: ${testFileId}`
    );

    // First, check if we can read the current value
    const [currentValues] = await connection.query(
      "SELECT id, title, imageFileId FROM causes WHERE id = ?",
      [testCauseId]
    );

    if (currentValues.length === 0) {
      console.log(`No cause found with ID ${testCauseId}`);
      return;
    }

    console.log("Current values:", currentValues[0]);

    // Update just the imageFileId
    try {
      const [updateResult] = await connection.query(
        "UPDATE causes SET imageFileId = ? WHERE id = ?",
        [testFileId, testCauseId]
      );

      console.log("Update result:", updateResult);
    } catch (updateError) {
      console.error("Error during update:", updateError);
      console.log("Checking if imageFileId column exists...");

      // Check if the column exists
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'causes'
        AND COLUMN_NAME = 'imageFileId'
      `);

      if (columns.length === 0) {
        console.log(
          "The imageFileId column does NOT exist in the causes table!"
        );
        console.log("Running the migration script to add it...");

        try {
          await connection.query(`
            ALTER TABLE causes
            ADD COLUMN imageFileId VARCHAR(255) NULL
            AFTER image
          `);
          console.log("Successfully added imageFileId column.");
        } catch (migrationError) {
          console.error("Error adding column:", migrationError);
        }
      } else {
        console.log(
          "The imageFileId column exists, but there was still an error updating it."
        );
      }

      return;
    }

    // Check if the update worked
    const [updatedValues] = await connection.query(
      "SELECT id, title, imageFileId FROM causes WHERE id = ?",
      [testCauseId]
    );

    console.log("Updated values:", updatedValues[0]);

    // Reset the value to avoid affecting actual data
    await connection.query("UPDATE causes SET imageFileId = ? WHERE id = ?", [
      currentValues[0].imageFileId,
      testCauseId,
    ]);

    console.log("Test completed. Value has been reset to original state.");
  } catch (error) {
    console.error("Error testing imageFileId update:", error);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit(0);
  }
}

testImageFileIdUpdate();

testImageFileIdUpdate();
