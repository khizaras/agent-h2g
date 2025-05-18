require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

// Configuration
const API_URL = "http://localhost:5000/api";
const TEST_IMAGE_PATH = path.join(__dirname, "test_image.jpg"); // Make sure this file exists

// Create a test image if it doesn't exist
function createTestImageIfNeeded() {
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
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

    fs.writeFileSync(TEST_IMAGE_PATH, jpegHeader);
    console.log("Test image created at:", TEST_IMAGE_PATH);
  }
}

// Login to get auth token
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: "test@example.com", // Replace with actual test user
      password: "password123", // Replace with actual password
    });

    return response.data.token;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}

// Test creating a cause with an image
async function createCauseWithImage(token) {
  try {
    createTestImageIfNeeded();

    const formData = new FormData();
    formData.append("title", "Test Cause with ImageKit");
    formData.append(
      "description",
      "This is a test cause with an image uploaded to ImageKit"
    );
    formData.append("location", "Test Location");
    formData.append("category_id", "1"); // Adjust based on your DB
    formData.append("funding_goal", "1000");
    formData.append("image", fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.post(`${API_URL}/causes`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Create cause response:", response.data);
    return response.data.cause;
  } catch (error) {
    console.error(
      "Create cause failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Test updating a cause with a new image
async function updateCauseWithImage(token, causeId) {
  try {
    createTestImageIfNeeded();

    const formData = new FormData();
    formData.append("title", "Updated Test Cause with ImageKit");
    formData.append("description", "This cause was updated with a new image");
    formData.append("image", fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.put(`${API_URL}/causes/${causeId}`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Update cause response:", response.data);
    return response.data.cause;
  } catch (error) {
    console.error(
      "Update cause failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Test retrieving a cause to verify image URLs
async function getCause(causeId) {
  try {
    const response = await axios.get(`${API_URL}/causes/${causeId}`);

    console.log("Get cause response:");
    console.log(`- ID: ${response.data.cause.id}`);
    console.log(`- Title: ${response.data.cause.title}`);
    console.log(`- Image URL: ${response.data.cause.image}`);
    console.log(`- ImageFileId: ${response.data.cause.imageFileId}`);

    return response.data.cause;
  } catch (error) {
    console.error("Get cause failed:", error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function testFullImageUploadFlow() {
  try {
    console.log("Starting full image upload flow test...");

    // Step 1: Login and get token
    console.log("\n--- Step 1: Login ---");
    const token = await login();
    console.log("Login successful, token obtained");

    // Step 2: Create a new cause with image
    console.log("\n--- Step 2: Create cause with image ---");
    const newCause = await createCauseWithImage(token);
    console.log(`Created cause with ID: ${newCause.id}`);

    // Step 3: Get the created cause to verify image URL
    console.log("\n--- Step 3: Verify created cause image ---");
    const retrievedCause = await getCause(newCause.id);
    if (retrievedCause.image && retrievedCause.imageFileId) {
      console.log("✅ Image successfully uploaded to ImageKit");
    } else {
      console.log("❌ Image not properly uploaded to ImageKit");
    }

    // Step 4: Update the cause with a new image
    console.log("\n--- Step 4: Update cause with new image ---");
    const updatedCause = await updateCauseWithImage(token, newCause.id);
    console.log(`Updated cause with ID: ${updatedCause.id}`);

    // Step 5: Get the updated cause to verify new image URL
    console.log("\n--- Step 5: Verify updated cause image ---");
    const retrievedUpdatedCause = await getCause(newCause.id);
    if (retrievedUpdatedCause.image && retrievedUpdatedCause.imageFileId) {
      console.log("✅ Image successfully updated in ImageKit");
    } else {
      console.log("❌ Image not properly updated in ImageKit");
    }

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testFullImageUploadFlow();
