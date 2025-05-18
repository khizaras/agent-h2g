const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");
const { uploadFile } = require("../utils/imageKitService");

/**
 * Migrates existing locally-stored images to ImageKit
 * This is a one-time migration script to move existing images to the cloud
 */
async function migrateImagesToImageKit() {
  try {
    console.log("Starting migration of images to ImageKit...");

    // Get all causes with images
    const [causes] = await pool.query(
      "SELECT id, image FROM causes WHERE image IS NOT NULL AND imageFileId IS NULL"
    );

    console.log(`Found ${causes.length} causes with images to migrate.`);

    let successCount = 0;
    let errorCount = 0;

    // Process each cause with an image
    for (const cause of causes) {
      try {
        // Check if the image path is already a full URL (already migrated)
        if (cause.image.startsWith("http")) {
          console.log(
            `Cause #${cause.id} already has a URL image: ${cause.image}`
          );
          continue;
        }

        // Local file path
        const localImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          cause.image
        );

        // Check if the file exists locally
        if (!fs.existsSync(localImagePath)) {
          console.log(
            `Image ${localImagePath} for cause #${cause.id} does not exist locally, skipping.`
          );
          continue;
        }

        // Create a file object similar to what multer would provide
        const file = {
          path: localImagePath,
          filename: path.basename(cause.image),
          originalname: path.basename(cause.image),
        };

        // Upload to ImageKit
        console.log(`Uploading ${file.filename} to ImageKit...`);
        const uploadResult = await uploadFile(file, "causes");

        // Update the cause record with the new URL and file ID
        await pool.query(
          "UPDATE causes SET image = ?, imageFileId = ? WHERE id = ?",
          [uploadResult.url, uploadResult.fileId, cause.id]
        );

        console.log(`Successfully migrated image for cause #${cause.id}`);
        successCount++;
      } catch (error) {
        console.error(`Error migrating image for cause #${cause.id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `Migration complete. ${successCount} images migrated successfully, ${errorCount} errors.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error during image migration:", error);
    process.exit(1);
  }
}

migrateImagesToImageKit();
