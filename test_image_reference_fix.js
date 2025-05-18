/**
 * Test script to verify the fix for the "image is not defined" error in causeController.js
 *
 * This script simulates the updateCause controller function without needing a server
 * to be running or making real HTTP requests.
 */

// Mock the cause model and other dependencies
const mockCause = {
  findById: jest.fn(),
  update: jest.fn(),
};

// Mock the imageKitService
const mockImageKitService = {
  deleteFile: jest.fn(),
};

// Create a mock req and res for testing
const mockReq = {
  params: { id: "1" },
  body: {
    title: "Updated Cause",
    description: "Updated description",
    location: "Updated location",
    category_id: "1",
  },
  user: { id: 1, is_admin: false },
  file: {
    imagekit: {
      url: "https://ik.imagekit.io/test/new-image.jpg",
      fileId: "new-file-id-12345",
    },
  },
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock require function
jest.mock("../../models/Cause", () => mockCause);
jest.mock("../utils/imageKitService", () => mockImageKitService);

// Import and test the actual controller function
const updateCause = require("../../controllers/causeController").updateCause;

// Test the function
async function testUpdateCauseImageReference() {
  console.log("Testing updateCause function with image handling...");

  // Setup the mock cause to be returned
  mockCause.findById.mockResolvedValue({
    id: 1,
    title: "Old Title",
    description: "Old Description",
    user_id: 1,
    image: "https://ik.imagekit.io/test/old-image.jpg",
    imageFileId: "old-file-id-12345",
  });

  mockCause.update.mockResolvedValue({
    id: 1,
    title: "Updated Cause",
    description: "Updated description",
    user_id: 1,
    image: "https://ik.imagekit.io/test/new-image.jpg",
    imageFileId: "new-file-id-12345",
  });

  // Test the controller function
  try {
    await updateCause(mockReq, mockRes);

    console.log("Mock function calls:");
    console.log("- findById called:", mockCause.findById.mock.calls);
    console.log(
      "- deleteFile called:",
      mockImageKitService.deleteFile.mock.calls
    );
    console.log("- update called:", mockCause.update.mock.calls);
    console.log("- status called:", mockRes.status.mock.calls);
    console.log("- json called:", mockRes.json.mock.calls);

    console.log("\nResults:");
    if (mockRes.status.mock.calls[0][0] === 200) {
      console.log("✅ Function executed successfully with status 200");
    } else {
      console.log(
        "❌ Function returned unexpected status:",
        mockRes.status.mock.calls[0][0]
      );
    }

    console.log("\nTest completed.");
  } catch (error) {
    console.error("Error occurred during test:", error);
  }
}

// Run the test
testUpdateCauseImageReference();
