/**
 * Advanced Email Service Testing Tool
 * This script provides a more flexible way to test emails in the Hands2gether application
 *
 * Run with: node testEmailsAdvanced.js [option]
 * Options:
 *   --all         Test all email types
 *   --welcome     Test welcome email
 *   --cause       Test new cause notification
 *   --contribute  Test contribution emails
 *   --feedback    Test feedback emails
 *   --follow      Test follow cause email
 *   --reset       Test password reset email
 *   --custom      Send a custom test email
 */

require("dotenv").config();
const readline = require("readline");
const {
  sendEmail,
  sendWelcomeEmail,
  sendContributionEmail,
  sendContributionConfirmationEmail,
  sendNewCauseNotification,
  sendFeedbackReceivedEmail,
  sendFeedbackResponseEmail,
  sendFollowCauseEmail,
  sendPasswordResetEmail,
} = require("./emailService");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Configuration - Edit these or set in .env file
const TEST_EMAIL = process.env.TEST_EMAIL || "your-test-email@example.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@hands2gether.org";

// Mock data for testing
const mockUser = {
  id: "user123",
  name: "Test User",
  email: TEST_EMAIL,
};

const mockCause = {
  id: "cause123",
  title: "Feed the Hungry Campaign",
  description:
    "A campaign to provide meals to homeless people in downtown area. We aim to distribute 100 meals every weekend to those in need. Your support makes a huge difference in their lives.",
  creator_email: TEST_EMAIL,
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

const mockAnonymousContribution = {
  cause: mockCause,
  user: { ...mockUser, anonymous: true },
  amount: 50,
  food_quantity: 10,
};

const mockFeedback = {
  name: "Feedback User",
  email: TEST_EMAIL,
  subject: "Website Suggestion",
  message:
    "I think it would be great to add a feature that shows the impact of donations in real-time.",
};

const mockFeedbackResponse = {
  userEmail: TEST_EMAIL,
  userName: "Feedback User",
  subject: "Website Suggestion",
  responseMessage:
    "Thank you for your suggestion! We're working on implementing a real-time impact tracker.",
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

// Check if email configuration is set up
function checkEmailConfig() {
  if (
    !process.env.MAIL_HOST ||
    !process.env.MAIL_ID ||
    !process.env.MAIL_PASS
  ) {
    console.error("Email configuration missing in .env file!");
    console.error("Please ensure you have set:");
    console.error("- MAIL_HOST (e.g., smtp.gmail.com)");
    console.error("- MAIL_ID (your email address)");
    console.error("- MAIL_PASS (your email password or app password)");
    return false;
  }
  return true;
}

// Test Welcome Email (Signup)
async function testWelcomeEmail() {
  console.log("\nTesting Welcome Email...");
  try {
    await sendWelcomeEmail(mockUser);
    console.log("✓ Welcome email sent successfully to:", mockUser.email);
  } catch (error) {
    console.error("✗ Failed to send welcome email:", error.message);
  }
}

// Test Contribution Emails
async function testContributionEmails() {
  console.log("\nTesting Contribution Emails...");
  try {
    // Test notification to cause owner
    await sendContributionEmail(mockContribution);
    console.log(
      "✓ Contribution notification email sent to cause owner:",
      mockCause.creator_email
    );
    await delay(1000);

    // Test confirmation to contributor
    await sendContributionConfirmationEmail(mockContribution);
    console.log(
      "✓ Contribution confirmation email sent to contributor:",
      mockUser.email
    );
    await delay(1000);

    // Test anonymous contribution
    await sendContributionEmail(mockAnonymousContribution);
    console.log(
      "✓ Anonymous contribution notification email sent to cause owner:",
      mockCause.creator_email
    );
  } catch (error) {
    console.error("✗ Failed to send contribution emails:", error.message);
  }
}

// Test New Cause Notification
async function testNewCauseNotification() {
  console.log("\nTesting New Cause Notification...");
  try {
    // Create an array of mock users to simulate multiple recipients
    const mockUsers = [
      mockUser,
      { ...mockUser, id: "user456", name: "Another User", email: TEST_EMAIL },
    ];

    await sendNewCauseNotification(mockUsers, mockCause);
    console.log("✓ New cause notification email sent to all users");
  } catch (error) {
    console.error("✗ Failed to send new cause notification:", error.message);
  }
}

// Test Feedback Emails
async function testFeedbackEmails() {
  console.log("\nTesting Feedback Emails...");
  try {
    // Test feedback received notification to admin
    await sendFeedbackReceivedEmail(mockFeedback);
    console.log("✓ Feedback received notification sent to admin");
    await delay(1000);

    // Test feedback response to user
    await sendFeedbackResponseEmail(mockFeedbackResponse);
    console.log(
      "✓ Feedback response email sent to user:",
      mockFeedbackResponse.userEmail
    );
  } catch (error) {
    console.error("✗ Failed to send feedback emails:", error.message);
  }
}

// Test Follow Cause Email
async function testFollowCauseEmail() {
  console.log("\nTesting Follow Cause Email...");
  try {
    await sendFollowCauseEmail(mockFollowData);
    console.log("✓ Follow cause email sent to:", mockUser.email);
  } catch (error) {
    console.error("✗ Failed to send follow cause email:", error.message);
  }
}

// Test Password Reset Email
async function testPasswordResetEmail() {
  console.log("\nTesting Password Reset Email...");
  try {
    await sendPasswordResetEmail(mockUser, mockResetToken, mockResetUrl);
    console.log("✓ Password reset email sent to:", mockUser.email);
  } catch (error) {
    console.error("✗ Failed to send password reset email:", error.message);
  }
}

// Send custom test email
async function sendCustomTestEmail() {
  console.log("\nSending Custom Test Email:");

  const promptQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    const recipient =
      (await promptQuestion(
        "Recipient email (default: " + TEST_EMAIL + "): "
      )) || TEST_EMAIL;
    const subject = await promptQuestion("Subject: ");
    const message = await promptQuestion("Message (HTML supported): ");

    const emailOptions = {
      to: recipient,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">Test Email</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            ${message}
          </div>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>This is a test email from Hands2gether Email Testing Tool</p>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
    console.log("✓ Custom test email sent to:", recipient);
  } catch (error) {
    console.error("✗ Failed to send custom test email:", error.message);
  }
}

// Run all email tests
async function runAllTests() {
  if (!checkEmailConfig()) return;

  console.log("Starting comprehensive email testing...");

  await testWelcomeEmail();
  await delay(1000);

  await testContributionEmails();
  await delay(1000);

  await testNewCauseNotification();
  await delay(1000);

  await testFeedbackEmails();
  await delay(1000);

  await testFollowCauseEmail();
  await delay(1000);

  await testPasswordResetEmail();

  console.log("\n✓ All email tests completed!");
  console.log(`Check your inbox at: ${TEST_EMAIL}`);
}

// Process command line arguments and run the appropriate test
async function main() {
  try {
    const arg = process.argv[2] || "--help";

    switch (arg) {
      case "--all":
        await runAllTests();
        break;
      case "--welcome":
        if (checkEmailConfig()) await testWelcomeEmail();
        break;
      case "--contribute":
        if (checkEmailConfig()) await testContributionEmails();
        break;
      case "--cause":
        if (checkEmailConfig()) await testNewCauseNotification();
        break;
      case "--feedback":
        if (checkEmailConfig()) await testFeedbackEmails();
        break;
      case "--follow":
        if (checkEmailConfig()) await testFollowCauseEmail();
        break;
      case "--reset":
        if (checkEmailConfig()) await testPasswordResetEmail();
        break;
      case "--custom":
        if (checkEmailConfig()) await sendCustomTestEmail();
        break;
      default:
        console.log("Email Testing Tool for Hands2gether");
        console.log("\nUsage: node testEmailsAdvanced.js [option]");
        console.log("\nOptions:");
        console.log("  --all         Test all email types");
        console.log("  --welcome     Test welcome email");
        console.log("  --cause       Test new cause notification");
        console.log("  --contribute  Test contribution emails");
        console.log("  --feedback    Test feedback emails");
        console.log("  --follow      Test follow cause email");
        console.log("  --reset       Test password reset email");
        console.log("  --custom      Send a custom test email");
        break;
    }
  } catch (error) {
    console.error("Error running tests:", error);
  } finally {
    if (arg === "--custom") {
      // Keep readline interface open for custom email
    } else {
      rl.close();
    }
  }
}

// Run the main function
main().then(() => {
  if (process.argv[2] !== "--custom") {
    // Exit process after tests unless in custom mode
    setTimeout(() => process.exit(0), 1000);
  }
});

// Handle readline close
rl.on("close", () => {
  console.log("\nEmail testing completed");
  process.exit(0);
});
