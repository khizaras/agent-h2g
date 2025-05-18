require("dotenv").config();
const {
  imagekit,
  uploadFile,
  deleteFile,
  listFiles,
} = require("./imageKitService");

async function testImageKit() {
  try {
    console.log("Testing ImageKit integration...");

    // Test connectivity by listing files
    console.log("Listing files in 'causes' folder...");
    const files = await listFiles("causes");
    console.log(`Found ${files.length} files in the 'causes' folder.`);

    if (files.length > 0) {
      console.log("Sample file:", {
        name: files[0].name,
        fileId: files[0].fileId,
        url: files[0].url,
        size: files[0].size,
        createdAt: files[0].createdAt,
      });
    }

    console.log("ImageKit integration test completed successfully.");
  } catch (error) {
    console.error("Error testing ImageKit integration:", error);
  }
}

testImageKit();
