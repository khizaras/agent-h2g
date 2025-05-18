require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

// Test updating a cause with an image
async function testUpdateCause() {
  try {
    // Replace these with actual values for your system
    const causeId = 1; // ID of the cause to update
    // We'll get a token from login
    const localImagePath = path.join(__dirname, "test-image.jpg");

    // Create a test image if it doesn't exist
    if (!fs.existsSync(localImagePath)) {
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

      fs.writeFileSync(localImagePath, jpegHeader);
      console.log(`Created test image at: ${localImagePath}`);
    }

    // Login to get auth token
    console.log("Logging in to get auth token...");
    const loginResponse = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: "test@example.com", // Replace with actual test user
        password: "password123", // Replace with actual password
      }
    );

    const token = loginResponse.data.token;
    console.log("Login successful, token obtained");

    console.log("Updating cause...");

    // Create a form data object
    const formData = new FormData();
    formData.append("title", "Updated Test Cause");
    formData.append(
      "description",
      "This is an updated test cause with a new image"
    );
    formData.append("location", "Test Location");
    formData.append("category_id", "1");
    formData.append("image", fs.createReadStream(localImagePath));

    // Send the request
    const response = await axios.put(
      `http://localhost:5000/api/causes/${causeId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Update response:", response.data);
  } catch (error) {
    console.error(
      "Error updating cause:",
      error.response ? error.response.data : error.message
    );
  }
}

// Instructions for use:
console.log(`
This script helps you test updating a cause with an image.

Before running this script:
1. Make sure your server is running
2. Update the causeId variable with an actual cause ID from your database
3. Update the token variable with a valid JWT token for a user that has permission to update the cause

To get a token, you can login through the app and check the developer tools network tab.
`);

// Uncomment the line below to run the test
testUpdateCause();
