require("dotenv").config();
const { pool } = require("./backend/config/db");
const { uploadFile } = require("./backend/utils/imageKitService");
const fs = require("fs");
const path = require("path");

// Simple test to verify imageFileId updates work
async function testImageFileIdUpdate() {
  try {
    console.log("Testing imageFileId column update...");

    // Get direct connection to the database
    const connection = await pool.getConnection();
    console.log("Successfully connected to the database");

    // Get a cause to test with
    const [causes] = await connection.query(
      "SELECT id, title, image, imageFileId FROM causes LIMIT 1"
    );

    if (causes.length === 0) {
      console.log("No causes found in database");
      connection.release();
      return;
    }

    const testCause = causes[0];
    console.log("Test cause:", testCause);

    // Create a test value for imageFileId
    const testFileId = "test-file-id-" + Date.now();

    // Update just the imageFileId
    try {
      console.log(
        `Updating cause ID ${testCause.id} with imageFileId: ${testFileId}`
      );

      const [updateResult] = await connection.query(
        "UPDATE causes SET imageFileId = ? WHERE id = ?",
        [testFileId, testCause.id]
      );

      console.log("Update result:", updateResult);

      // Verify the update
      const [updatedCauses] = await connection.query(
        "SELECT id, title, image, imageFileId FROM causes WHERE id = ?",
        [testCause.id]
      );

      console.log("Updated cause:", updatedCauses[0]);

      // Restore original value
      await connection.query("UPDATE causes SET imageFileId = ? WHERE id = ?", [
        testCause.imageFileId,
        testCause.id,
      ]);

      console.log("Original imageFileId restored");
    } catch (error) {
      console.error("Error during update test:", error);
    }

    connection.release();
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testImageFileIdUpdate();
