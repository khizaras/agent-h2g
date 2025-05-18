require("dotenv").config();
const { pool } = require("../config/db");
const { imagekit, listFiles } = require("./imageKitService");

/**
 * Verifies the ImageKit integration by comparing database records with ImageKit files.
 * This helps ensure that all images in the database have corresponding entries in ImageKit.
 */
async function verifyImageKitIntegration() {
  try {
    console.log("Verifying ImageKit integration...");

    // Get all causes with ImageKit fileIds
    const [causes] = await pool.query(
      "SELECT id, title, image, imageFileId FROM causes WHERE imageFileId IS NOT NULL"
    );
    console.log(`Found ${causes.length} causes with ImageKit file IDs.`);

    if (causes.length === 0) {
      console.log(
        "No causes with ImageKit file IDs found. Run the migration script first."
      );
      return;
    }

    // Get files from ImageKit
    const files = await listFiles("causes");
    console.log(`Found ${files.length} files in ImageKit 'causes' folder.`);

    // Create a map of file IDs
    const imageKitFileIds = new Map();
    files.forEach((file) => {
      imageKitFileIds.set(file.fileId, file);
    });

    // Verify each cause
    let validCount = 0;
    let invalidCount = 0;

    for (const cause of causes) {
      const fileExists = imageKitFileIds.has(cause.imageFileId);

      if (fileExists) {
        validCount++;
        console.log(
          `✅ Cause #${cause.id} "${cause.title.substring(
            0,
            30
          )}..." - Image verified (${cause.imageFileId})`
        );
      } else {
        invalidCount++;
        console.log(
          `❌ Cause #${cause.id} "${cause.title.substring(
            0,
            30
          )}..." - Image not found in ImageKit (${cause.imageFileId})`
        );
      }
    }

    console.log("\nVerification Summary:");
    console.log(`Total causes with ImageKit file IDs: ${causes.length}`);
    console.log(`Valid image references: ${validCount}`);
    console.log(`Invalid image references: ${invalidCount}`);

    if (invalidCount > 0) {
      console.log(
        "\nSome causes have invalid ImageKit file IDs. Run the migration script to fix this issue."
      );
    } else {
      console.log(
        "\nAll causes have valid ImageKit image references. Integration appears to be working correctly."
      );
    }
  } catch (error) {
    console.error("Error verifying ImageKit integration:", error);
  }
}

verifyImageKitIntegration();
