const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Send email
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);

    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Email could not be sent");
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const emailOptions = {
      to: user.email,
      subject: "Welcome to Hands2gether!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">Welcome to Hands2gether, ${user.name}!</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; line-height: 1.6;">Thank you for joining our community dedicated to feeding people in need. Your participation makes a real difference!</p>
            <p style="font-size: 16px; line-height: 1.6;">With Hands2gether, you can:</p>
            <ul style="font-size: 16px; line-height: 1.8;">
              <li>Create causes to help those in need</li>
              <li>Contribute to existing causes</li>
              <li>Connect with like-minded individuals</li>
              <li>Make a meaningful impact in your community</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://hands2gether.org/dashboard" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Explore Causes</a>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">If you have any questions, feel free to reply to this email or contact our support team.</p>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Welcome email error:", error);
    // Don't throw here, just log the error
  }
};

// Send contribution notification email to cause owner
const sendContributionEmail = async (contributionData) => {
  try {
    const { cause, user, amount, food_quantity } = contributionData;

    const emailOptions = {
      to: cause.creator_email,
      subject: `New contribution to your cause: ${cause.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">New Contribution Received!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Your cause <strong>${
            cause.title
          }</strong> has received a new contribution.</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            ${
              amount
                ? `<p style="font-size: 18px; margin: 10px 0;"><strong>Amount:</strong> $${amount}</p>`
                : ""
            }
            ${
              food_quantity
                ? `<p style="font-size: 18px; margin: 10px 0;"><strong>Food Quantity:</strong> ${food_quantity} items</p>`
                : ""
            }
            ${
              !user.anonymous
                ? `<p style="font-size: 18px; margin: 10px 0;"><strong>From:</strong> ${user.name}</p>`
                : '<p style="font-size: 18px; margin: 10px 0;"><strong>From:</strong> Anonymous</p>'
            }
          </div>
          <p style="font-size: 16px; line-height: 1.6;">This contribution brings you closer to your goal. Thank you for creating this important cause!</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://hands2gether.org/causes/${
              cause.id
            }" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Cause</a>
          </div>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Contribution email error:", error);
    // Don't throw here, just log the error
  }
};

// Send contribution confirmation email to contributor
const sendContributionConfirmationEmail = async (contributionData) => {
  try {
    const { cause, user, amount, food_quantity } = contributionData;

    const emailOptions = {
      to: user.email,
      subject: `Thank you for your contribution to ${cause.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">Thank You for Your Contribution!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Your generosity makes a real difference. Thank you for contributing to <strong>${
            cause.title
          }</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="color: #333; margin-top: 0;">Contribution Details:</h3>
            ${
              amount
                ? `<p style="font-size: 18px; margin: 10px 0;"><strong>Amount:</strong> $${amount}</p>`
                : ""
            }
            ${
              food_quantity
                ? `<p style="font-size: 18px; margin: 10px 0;"><strong>Food Quantity:</strong> ${food_quantity} items</p>`
                : ""
            }
            <p style="font-size: 18px; margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">Your contribution helps those in need and strengthens our community. Together, we can make a meaningful impact.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://hands2gether.org/causes/${
              cause.id
            }" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Cause</a>
          </div>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Contribution confirmation email error:", error);
    // Don't throw here, just log the error
  }
};

// Send new cause notification to all users
const sendNewCauseNotification = async (users, cause) => {
  try {
    // For bulk emails, we should use BCC to protect user privacy
    const bccRecipients = users.map((user) => user.email).join(",");

    const emailOptions = {
      to: process.env.EMAIL_FROM, // Send to self
      bcc: bccRecipients, // BCC all users
      subject: `New Cause Alert: ${cause.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">New Cause Alert!</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="color: #333; margin-top: 0;">${cause.title}</h3>
            <p style="font-size: 16px; line-height: 1.6;">${cause.description.substring(
              0,
              200
            )}${cause.description.length > 200 ? "..." : ""}</p>
            <p style="font-size: 16px; line-height: 1.6;"><strong>Category:</strong> ${
              cause.category
            }</p>
            <p style="font-size: 16px; line-height: 1.6;"><strong>Location:</strong> ${
              cause.location
            }</p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://hands2gether.org/causes/${
              cause.id
            }" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View This Cause</a>
          </div>
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">Together, we can make a difference in our community.</p>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <p style="font-size: 12px; color: #999;">If you no longer wish to receive notifications about new causes, <a href="https://hands2gether.org/unsubscribe" style="color: #4CAF50;">unsubscribe here</a>.</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("New cause notification email error:", error);
    // Don't throw here, just log the error
  }
};

// Send feedback received notification
const sendFeedbackReceivedEmail = async (feedback) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

    const emailOptions = {
      to: adminEmail,
      subject: `New Feedback Received: ${feedback.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">New Feedback Received</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <p style="font-size: 16px; margin: 10px 0;"><strong>From:</strong> ${feedback.name} (${feedback.email})</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong>Subject:</strong> ${feedback.subject}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong>Message:</strong></p>
            <p style="font-size: 16px; line-height: 1.6; background-color: #ffffff; padding: 15px; border-radius: 5px;">${feedback.message}</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">Please respond to this feedback as soon as possible.</p>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Feedback notification email error:", error);
    // Don't throw here, just log the error
  }
};

// Send feedback response email to user
const sendFeedbackResponseEmail = async (feedbackResponse) => {
  try {
    const { userEmail, userName, subject, responseMessage } = feedbackResponse;

    const emailOptions = {
      to: userEmail,
      subject: `Response to Your Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">Response to Your Feedback</h2>
          <p style="font-size: 16px; line-height: 1.6;">Dear ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for sharing your feedback with us. We appreciate you taking the time to help us improve.</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <p style="font-size: 16px; margin: 10px 0;"><strong>Regarding:</strong> ${subject}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong>Our Response:</strong></p>
            <p style="font-size: 16px; line-height: 1.6; background-color: #ffffff; padding: 15px; border-radius: 5px;">${responseMessage}</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">If you have any further questions or concerns, please don't hesitate to reach out.</p>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Feedback response email error:", error);
    // Don't throw here, just log the error
  }
};

// Send cause follow notification
const sendFollowCauseEmail = async (followData) => {
  try {
    const { user, cause } = followData;

    const emailOptions = {
      to: user.email,
      subject: `You're Now Following: ${cause.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">You're Now Following a Cause!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hi ${user.name},</p>
          <p style="font-size: 16px; line-height: 1.6;">You are now following <strong>${
            cause.title
          }</strong>. You'll receive updates about this cause's progress and activities.</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="color: #333; margin-top: 0;">Cause Details:</h3>
            <p style="font-size: 16px; line-height: 1.6;">${cause.description.substring(
              0,
              200
            )}${cause.description.length > 200 ? "..." : ""}</p>
            <p style="font-size: 16px; line-height: 1.6;"><strong>Current Status:</strong> ${
              cause.status || "Active"
            }</p>
            ${
              cause.progress
                ? `<p style="font-size: 16px; line-height: 1.6;"><strong>Progress:</strong> ${cause.progress}%</p>`
                : ""
            }
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://hands2gether.org/causes/${
              cause.id
            }" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Cause</a>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for your interest and support!</p>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <p style="font-size: 12px; color: #999;">You can unfollow this cause at any time from your dashboard.</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Follow cause email error:", error);
    // Don't throw here, just log the error
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken, resetUrl) => {
  try {
    const emailOptions = {
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://hands2gether.org/logo.png" alt="Hands2gether Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px;">Reset Your Password</h2>
          <p style="font-size: 16px; line-height: 1.6;">You requested a password reset. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFA500;">
            <p style="font-size: 14px; line-height: 1.6; color: #555;">If you didn't request this, please ignore this email or contact support if you're concerned about your account's security.</p>
            <p style="font-size: 14px; line-height: 1.6; color: #555;">This link will expire in 1 hour.</p>
          </div>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: center; color: #666666;">
            <p>Best regards,<br>The Hands2gether Team</p>
            <div style="margin-top: 15px;">
              <a href="https://twitter.com/hands2gether" style="color: #1DA1F2; margin: 0 10px; text-decoration: none;">Twitter</a>
              <a href="https://facebook.com/hands2gether" style="color: #4267B2; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/hands2gether" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Password reset email error:", error);
    throw new Error("Password reset email could not be sent");
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendContributionEmail,
  sendContributionConfirmationEmail,
  sendNewCauseNotification,
  sendFeedbackReceivedEmail,
  sendFeedbackResponseEmail,
  sendFollowCauseEmail,
  sendPasswordResetEmail,
};
