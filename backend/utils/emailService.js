const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send email
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a4a4a;">Welcome to Hands2gether, ${user.name}!</h2>
          <p>Thank you for joining our community dedicated to feeding people in need.</p>
          <p>With Hands2gether, you can:</p>
          <ul>
            <li>Create causes to help those in need</li>
            <li>Contribute to existing causes</li>
            <li>Connect with like-minded individuals</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Hands2gether Team</p>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Welcome email error:", error);
    // Don't throw here, just log the error
  }
};

// Send contribution notification email
const sendContributionEmail = async (contributionData) => {
  try {
    const { cause, user, amount, food_quantity } = contributionData;

    const emailOptions = {
      to: cause.creator_email,
      subject: `New contribution to your cause: ${cause.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a4a4a;">New Contribution Received!</h2>
          <p>Your cause <strong>${
            cause.title
          }</strong> has received a new contribution.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${amount ? `<p>Amount: $${amount}</p>` : ""}
            ${
              food_quantity
                ? `<p>Food Quantity: ${food_quantity} items</p>`
                : ""
            }
            ${
              !user.anonymous
                ? `<p>From: ${user.name}</p>`
                : "<p>From: Anonymous</p>"
            }
          </div>
          <p>Thank you for creating this important cause!</p>
          <p>Best regards,<br>The Hands2gether Team</p>
        </div>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error("Contribution email error:", error);
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a4a4a;">Reset Your Password</h2>
          <p>You requested a password reset. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>The Hands2gether Team</p>
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
  sendPasswordResetEmail,
};
