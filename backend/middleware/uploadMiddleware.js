const multer = require("multer");
const path = require("path");
const { uploadFile } = require("../utils/imageKitService");

// Set temporary storage for multer
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads/temp/");
  },
  filename: (req, file, cb) => {
    // Use a unique filename with the original extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
  }
};

// Initialize upload
const upload = multer({
  storage: tempStorage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter,
});

// ImageKit upload middleware for causes
const uploadToImageKit = async (req, res, next) => {
  try {
    console.log("uploadToImageKit middleware called");
    console.log("Request file before ImageKit:", req.file);

    // If there's a file and it was successfully uploaded by multer
    if (req.file) {
      console.log("Uploading file to ImageKit:", {
        path: req.file.path,
        filename: req.file.filename,
        originalname: req.file.originalname,
      });

      // Upload to ImageKit
      const uploadResult = await uploadFile(req.file, "causes");
      console.log("ImageKit upload result:", uploadResult);

      // Store the ImageKit URL in the request for use in controllers
      req.file.imagekit = {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        name: uploadResult.name,
      };

      console.log("Request file after ImageKit:", req.file);
    } else {
      console.log("No file to upload to ImageKit");
    }
    next();
  } catch (error) {
    console.error("ImageKit upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload image to cloud storage",
    });
  }
};

// Handle multer errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File is too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
};

module.exports = { upload, uploadToImageKit, handleUploadError };
