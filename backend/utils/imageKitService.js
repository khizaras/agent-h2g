const ImageKit = require("imagekit");
const fs = require("fs");
const path = require("path");

// Initialize ImageKit instance with environment variables
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file to ImageKit from a file path
 * @param {Object} file - The file object from multer
 * @param {string} folder - Optional folder path in ImageKit
 * @returns {Promise<Object>} - The ImageKit response including the URL
 */
const uploadFile = async (file, folder = "causes") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    console.log("uploadFile called with:", {
      path: file.path,
      filename: file.filename,
      originalname: file.originalname,
      folder,
    });

    const filePath = file.path;
    const fileName = `${Date.now()}_${path.basename(
      file.originalname || file.filename
    )}`;

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    console.log(`File size: ${fileBuffer.length} bytes`);

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName,
      useUniqueFileName: true,
      folder,
    });

    console.log("ImageKit upload response:", {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    });

    // Remove the local file after successful upload
    fs.unlinkSync(filePath);

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw error;
  }
};

/**
 * Delete a file from ImageKit
 * @param {string} fileId - The file ID from ImageKit
 * @returns {Promise<Object>} - The deletion response
 */
const deleteFile = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error("No file ID provided");
    }

    const response = await imagekit.deleteFile(fileId);
    return response;
  } catch (error) {
    console.error("Error deleting from ImageKit:", error);
    throw error;
  }
};

/**
 * Get a list of files from ImageKit
 * @param {string} path - The folder path in ImageKit
 * @returns {Promise<Array>} - The list of files
 */
const listFiles = async (path = "causes") => {
  try {
    const response = await imagekit.listFiles({
      path,
    });
    return response;
  } catch (error) {
    console.error("Error listing files from ImageKit:", error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  listFiles,
  imagekit,
};
