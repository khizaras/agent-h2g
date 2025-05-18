require("dotenv").config();
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Test uploading an image with FormData
async function testImageUploadWithFormData() {
  try {
    console.log("Testing image upload with FormData");

    // Create a test image file
    const testImagePath = path.join(__dirname, "test-image.jpg");

    // Create a simple test image (a 1x1 pixel JPEG) if it doesn't exist
    if (!fs.existsSync(testImagePath)) {
      console.log("Creating test image file...");

      // Create a simple test image (a 1x1 pixel JPEG)
      const jpegHeader = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
        0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
        0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
        0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
        0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00,
        0x7f, 0x00, 0xff, 0xd9,
      ]);

      fs.writeFileSync(testImagePath, jpegHeader);
      console.log(`Created test image at: ${testImagePath}`);
    }

    // Login to get a token
    const loginResponse = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: "test@example.com", // Replace with actual test credentials
        password: "password123",
      }
    );

    const token = loginResponse.data.token;
    console.log("Obtained authentication token");

    // Create a form data object
    const formData = new FormData();
    formData.append("title", "Test Image Upload");
    formData.append(
      "description",
      "This is a test to verify image uploads work correctly. The description needs to be at least 50 characters long."
    );
    formData.append("location", "Test Location");
    formData.append("category_id", "1"); // Assuming category ID 1 exists

    // Important: Make sure the image field name matches what the server expects
    console.log("Attaching image file to formData");
    formData.append("image", fs.createReadStream(testImagePath));

    // Log form data entries for debugging
    for (const [key, value] of Object.entries(formData)) {
      console.log(`FormData contains: ${key}`);
    }

    // Create a cause with the image
    const response = await axios.post(
      "http://localhost:5000/api/causes",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response status:", response.status);
    console.log("Created cause:", response.data);

    if (response.data.cause && response.data.cause.image) {
      console.log("✅ SUCCESS: Image was successfully uploaded and stored");
      console.log("Image URL:", response.data.cause.image);
      console.log("Image File ID:", response.data.cause.imageFileId);
    } else {
      console.log("❌ FAILURE: Image was not stored properly");
    }
  } catch (error) {
    console.error("Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

// Run the test
testImageUploadWithFormData();
