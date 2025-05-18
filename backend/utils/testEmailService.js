/**
 * Test Script for Email Service
 * This script triggers all email types in the Hands2gether application
 *
 * Run with: node testEmailService.js
 */

require("dotenv").config();
const {
  sendWelcomeEmail,
  sendContributionEmail,
  sendContributionConfirmationEmail,
  sendNewCauseNotification,
  sendFeedbackReceivedEmail,
  sendFeedbackResponseEmail,
  sendFollowCauseEmail,
  sendPasswordResetEmail,
} = require("./emailService");

// Mock data for testing
const mockUser = {
  id: "user123",
  name: "Test User",
  email: process.env.TEST_EMAIL || "test@example.com",
};

const mockCause = {
  id: "cause123",
  title: "Feed the Hungry Campaign",
  description:
    "A campaign to provide meals to homeless people in downtown area. We aim to distribute 100 meals every weekend to those in need. Your support makes a huge difference in their lives.",
  creator_email: process.env.TEST_EMAIL || "test@example.com",
  category: "Food Donation",
  location: "Downtown",
  status: "Active",
  progress: 45,
};

const mockContribution = {
  cause: mockCause,
  user: mockUser,
  amount: 100,
  food_quantity: 20,
};

const mockFeedback = {
  name: "Feedback User",
  email: process.env.TEST_EMAIL || "test@example.com",
  subject: "Website Suggestion",
  message:
    "I think it would be great to add a feature that shows the impact of donations in real-time. This way, contributors can see how their donations are making a difference immediately.",
};

const mockFeedbackResponse = {
  userEmail: process.env.TEST_EMAIL || "test@example.com",
  userName: "Feedback User",
  subject: "Website Suggestion",
  responseMessage: `Thank you for your valuable suggestion! We're excited to let you know that we're already working on implementing a real-time impact tracker for donations. This feature should be available in our next update scheduled for next month. We appreciate your input and would love to hear your thoughts once the feature is live.`,
};

const mockFollowData = {
  user: mockUser,
  cause: mockCause,
};

// Reset token for password reset
const mockResetToken = "abc123def456";
const mockResetUrl = `https://hands2gether.org/reset-password?token=${mockResetToken}`;

// Utility to delay between email tests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Run the tests
async function runAllEmailTests() {
  console.log("Starting email service tests...");

  try {
    console.log("\n1. Testing Welcome Email (Signup)...");
    await sendWelcomeEmail(mockUser);
    console.log("✓ Welcome email test completed");
    await delay(2000);

    console.log("\n2. Testing Contribution Email to Cause Owner...");
    await sendContributionEmail(mockContribution);
    console.log("✓ Contribution notification email test completed");
    await delay(2000);

    console.log(
      "\n3. Testing Contribution Confirmation Email to Contributor..."
    );
    await sendContributionConfirmationEmail(mockContribution);
    console.log("✓ Contribution confirmation email test completed");
    await delay(2000);

    console.log("\n4. Testing New Cause Notification to All Users...");
    await sendNewCauseNotification(
      [mockUser, { ...mockUser, email: "test2@example.com" }],
      mockCause
    );
    console.log("✓ New cause notification email test completed");
    await delay(2000);

    console.log("\n5. Testing Feedback Received Notification...");
    await sendFeedbackReceivedEmail(mockFeedback);
    console.log("✓ Feedback received email test completed");
    await delay(2000);

    console.log("\n6. Testing Feedback Response Email...");
    await sendFeedbackResponseEmail(mockFeedbackResponse);
    console.log("✓ Feedback response email test completed");
    await delay(2000);

    console.log("\n7. Testing Follow Cause Email...");
    await sendFollowCauseEmail(mockFollowData);
    console.log("✓ Follow cause email test completed");
    await delay(2000);

    console.log("\n8. Testing Password Reset Email...");
    await sendPasswordResetEmail(mockUser, mockResetToken, mockResetUrl);
    console.log("✓ Password reset email test completed");

    console.log("\n✓ All email tests completed successfully!");
    console.log(
      "\nCheck your inbox at:",
      process.env.TEST_EMAIL || "test@example.com"
    );
    console.log(
      "\nNote: Make sure your email environment variables are properly configured in .env file:"
    );
    console.log("  - MAIL_HOST: Your SMTP host (e.g., smtp.gmail.com)");
    console.log("  - MAIL_ID: Your sender email");
    console.log("  - MAIL_PASS: Your email password or app password");
    console.log("  - TEST_EMAIL: Email to send test messages to");
    console.log("  - ADMIN_EMAIL: Admin email for feedback notifications");
  } catch (error) {
    console.error("Error during email tests:", error);
  }
}

// Run all tests
runAllEmailTests();
