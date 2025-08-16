import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com", // Update with hands2gethero.org SMTP
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: parseInt(process.env.SMTP_PORT || "587") === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "", // hands2gethero.org email
    pass: process.env.SMTP_PASSWORD || "", // App password
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Verify connection configuration
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email server connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error);
    return false;
  }
};

// Email templates
const EMAIL_TEMPLATES = {
  welcome: {
    subject: "Welcome to Hands2gether! 🤝",
    html: (data: { name: string; email: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Hands2gether</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
            .logo { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
            .header-subtitle { font-size: 18px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .welcome-title { font-size: 24px; color: #1e293b; margin-bottom: 16px; }
            .welcome-text { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
            .features { background: #f1f5f9; padding: 24px; border-radius: 8px; margin: 24px 0; }
            .feature { display: flex; align-items: center; margin: 12px 0; }
            .feature-icon { font-size: 20px; margin-right: 12px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">H2G</div>
              <div class="header-subtitle">Hands2gether</div>
            </div>
            <div class="content">
              <h1 class="welcome-title">Welcome to our community, ${data.name}! 🎉</h1>
              <p class="welcome-text">
                Thank you for joining Hands2gether! We're excited to have you as part of our community dedicated to making a positive impact in the world.
              </p>
              <div class="features">
                <div class="feature">
                  <span class="feature-icon">🚀</span>
                  <span>Create and share meaningful causes</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">💰</span>
                  <span>Support causes with secure donations</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">📊</span>
                  <span>Track your community impact</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">🤝</span>
                  <span>Connect with like-minded changemakers</span>
                </div>
              </div>
              <p class="welcome-text">
                Ready to start making a difference? Explore causes in your area or create your own to rally support for what matters most to you.
              </p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes" class="button">
                Explore Causes
              </a>
            </div>
            <div class="footer">
              <p>Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/contact">support center</a></p>
              <p>&copy; 2025 Hands2gether. Making the world a better place, together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  causeSupport: {
    subject: "Thank you for supporting: {causeName} 💖",
    html: (data: {
      supporterName: string;
      causeName: string;
      amount: number;
      message?: string;
      creatorName: string;
      causeUrl: string;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Your Support</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .header-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .amount-highlight { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
            .amount-value { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
            .cause-info { background: #f1f5f9; padding: 24px; border-radius: 12px; margin: 24px 0; }
            .cause-name { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
            .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">💖</div>
              <div class="header-title">Thank You for Your Generosity!</div>
            </div>
            <div class="content">
              <h1>Dear ${data.supporterName},</h1>
              <p>Your contribution is making a real difference! Thank you for supporting this important cause.</p>
              
              <div class="amount-highlight">
                <div class="amount-value">$${data.amount.toLocaleString()}</div>
                <div>Your generous contribution</div>
              </div>

              <div class="cause-info">
                <div class="cause-name">${data.causeName}</div>
                <p><strong>Cause Creator:</strong> ${data.creatorName}</p>
              </div>

              ${
                data.message
                  ? `
                <div class="message-box">
                  <strong>Your message:</strong><br>
                  "${data.message}"
                </div>
              `
                  : ""
              }

              <p>Your support helps bring this cause closer to its goal and creates meaningful impact in the community.</p>
              
              <a href="${data.causeUrl}" class="button">View Cause Progress</a>
            </div>
            <div class="footer">
              <p>You'll receive updates about this cause's progress. Thank you for being a changemaker!</p>
              <p>&copy; 2025 Hands2gether. Making the world a better place, together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  newComment: {
    subject: "New comment on your cause: {causeName}",
    html: (data: {
      creatorName: string;
      causeName: string;
      commenterName: string;
      comment: string;
      causeUrl: string;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Comment on Your Cause</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .content { padding: 40px 30px; }
            .comment-box { background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 24px 0; }
            .commenter { font-weight: 600; color: #1e293b; margin-bottom: 8px; }
            .comment-text { font-style: italic; line-height: 1.6; }
            .cause-name { font-size: 20px; font-weight: 700; color: #1e293b; margin: 24px 0 12px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">💬</div>
              <div>New Comment on Your Cause</div>
            </div>
            <div class="content">
              <h1>Hi ${data.creatorName},</h1>
              <p>Someone just commented on your cause and wanted to share their thoughts with you!</p>
              
              <div class="cause-name">${data.causeName}</div>
              
              <div class="comment-box">
                <div class="commenter">${data.commenterName} wrote:</div>
                <div class="comment-text">"${data.comment}"</div>
              </div>

              <p>Engagement like this shows how much your cause resonates with the community. Keep up the great work!</p>
              
              <a href="${data.causeUrl}" class="button">View & Respond</a>
            </div>
            <div class="footer">
              <p>Stay connected with your supporters and keep the conversation going!</p>
              <p>&copy; 2025 Hands2gether. Making the world a better place, together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  enrollmentConfirmation: {
    subject: "✅ Enrollment Confirmed: {courseName}",
    html: (data: {
      studentName: string;
      courseName: string;
      instructorName: string;
      startDate: string;
      endDate: string;
      courseId: number;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Course Enrollment Confirmed</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .content { padding: 40px 30px; }
            .course-details { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 8px; margin: 24px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dcfce7; }
            .detail-row:last-child { border-bottom: none; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">🎓</div>
              <h1>Enrollment Confirmed!</h1>
              <p>You're all set for your upcoming course</p>
            </div>
            <div class="content">
              <h2>Hello ${data.studentName},</h2>
              <p>Great news! Your enrollment has been confirmed for:</p>
              
              <div class="course-details">
                <h3>${data.courseName}</h3>
                <div class="detail-row">
                  <strong>Instructor:</strong>
                  <span>${data.instructorName}</span>
                </div>
                <div class="detail-row">
                  <strong>Start Date:</strong>
                  <span>${new Date(data.startDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <div class="detail-row">
                  <strong>End Date:</strong>
                  <span>${new Date(data.endDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Mark your calendar for the course dates</li>
                <li>Prepare any required materials (if specified)</li>
                <li>You'll receive course details and access information closer to the start date</li>
                <li>Feel free to reach out if you have any questions</li>
              </ul>

              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/causes/${data.courseId}" class="button">View Course Details</a>
              
              <p>We're excited to have you join us and look forward to your learning journey!</p>
            </div>
            <div class="footer">
              <p>Questions? Contact your instructor or our support team.</p>
              <p>&copy; 2025 Hands2gether. Empowering communities through education.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  newEnrollmentNotification: {
    subject: "📚 New Student Enrolled: {courseName}",
    html: (data: {
      instructorName: string;
      studentName: string;
      courseName: string;
      enrollmentDate: string;
      courseId: number;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Student Enrollment</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .content { padding: 40px 30px; }
            .enrollment-info { background: #eff6ff; border: 1px solid #bfdbfe; padding: 24px; border-radius: 8px; margin: 24px 0; }
            .student-name { font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">👥</div>
              <h1>New Student Enrolled!</h1>
              <p>A new student has joined your course</p>
            </div>
            <div class="content">
              <h2>Hello ${data.instructorName},</h2>
              <p>You have a new student enrolled in your course:</p>
              
              <div class="enrollment-info">
                <h3>${data.courseName}</h3>
                <div class="student-name">Student: ${data.studentName}</div>
                <p><strong>Enrolled on:</strong> ${new Date(data.enrollmentDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>

              <p>You can now:</p>
              <ul>
                <li>Review the updated student roster</li>
                <li>Send a welcome message to your new student</li>
                <li>Prepare course materials and resources</li>
                <li>Plan for the increased class size</li>
              </ul>

              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/causes/${data.courseId}" class="button">Manage Course</a>
              
              <p>Thank you for sharing your knowledge and expertise with the community!</p>
            </div>
            <div class="footer">
              <p>You can manage your courses and students through your instructor dashboard.</p>
              <p>&copy; 2025 Hands2gether. Empowering communities through education.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  passwordReset: {
    subject: "Reset your Hands2gether password 🔐",
    html: (data: { name: string; resetUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .header-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .warning-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 24px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .security-note { background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 24px 0; font-size: 12px; color: #64748b; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">🔐</div>
              <div class="header-title">Password Reset Request</div>
              <p>Someone requested to reset your password</p>
            </div>
            <div class="content">
              <h1>Hi ${data.name},</h1>
              <p>We received a request to reset your password for your Hands2gether account. If this was you, click the button below to create a new password.</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.resetUrl}" class="button">Reset Your Password</a>
              </div>

              <div class="warning-box">
                <strong>⚠️ Important Security Information:</strong>
                <ul style="margin: 8px 0 0 16px; padding: 0;">
                  <li>This link will expire in 1 hour for your security</li>
                  <li>You can only use this link once</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                </ul>
              </div>

              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px;">
                ${data.resetUrl}
              </p>

              <div class="security-note">
                <strong>🛡️ Security Tip:</strong> Always make sure you're on the official Hands2gether website before entering your new password. Our official domain is hands2gether.com
              </div>
            </div>
            <div class="footer">
              <p>If you have any concerns about this email, please contact our support team.</p>
              <p>&copy; 2025 Hands2gether. Keeping your account secure.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  emailVerification: {
    subject: "Please verify your email address ✉️",
    html: (data: { name: string; verificationUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .header-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .verification-box { background: #f0fdf4; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .info-note { background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 24px 0; font-size: 14px; color: #64748b; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">✉️</div>
              <div class="header-title">Verify Your Email</div>
              <p>One more step to complete your registration</p>
            </div>
            <div class="content">
              <h1>Hi ${data.name},</h1>
              <p>Thank you for registering with Hands2gether! To complete your account setup and start making a difference in your community, please verify your email address.</p>
              
              <div class="verification-box">
                <p><strong>Click the button below to verify your email:</strong></p>
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
              </div>

              <p>Once your email is verified, you'll be able to:</p>
              <ul>
                <li>Create and manage causes</li>
                <li>Comment and engage with the community</li>
                <li>Receive important notifications</li>
                <li>Connect with other community members</li>
              </ul>

              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px;">
                ${data.verificationUrl}
              </p>

              <div class="info-note">
                <strong>📝 Note:</strong> This verification link will expire in 24 hours for security reasons. If you need a new verification email, you can request one from the login page.
              </div>
            </div>
            <div class="footer">
              <p>If you didn't create this account, you can safely ignore this email.</p>
              <p>&copy; 2025 Hands2gether. Building stronger communities together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  causeStatusUpdate: {
    subject: (status: string) => `Your cause has been ${status} 📋`,
    html: (data: {
      userName: string;
      causeTitle: string;
      status: string;
      reason?: string;
      causeUrl: string;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cause Status Update</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: ${data.status === "approved" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"}; padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .header-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .status-box { background: ${data.status === "approved" ? "#f0fdf4" : "#fef3c7"}; border: 1px solid ${data.status === "approved" ? "#10b981" : "#f59e0b"}; padding: 20px; border-radius: 8px; margin: 24px 0; }
            .button { display: inline-block; background: ${data.status === "approved" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">${data.status === "approved" ? "✅" : "📋"}</div>
              <div class="header-title">Cause Status Update</div>
              <p>Your cause "${data.causeTitle}" has been ${data.status}</p>
            </div>
            <div class="content">
              <h1>Hi ${data.userName},</h1>
              <p>We wanted to update you on the status of your cause submission.</p>
              
              <div class="status-box">
                <h3>Cause: ${data.causeTitle}</h3>
                <p><strong>Status:</strong> ${data.status.toUpperCase()}</p>
                ${data.reason ? `<p><strong>Note:</strong> ${data.reason}</p>` : ""}
              </div>

              ${
                data.status === "approved"
                  ? `
                <p>Congratulations! Your cause is now live and visible to the community. You can:</p>
                <ul>
                  <li>Share your cause with friends and family</li>
                  <li>Engage with supporters through comments</li>
                  <li>Track your progress and impact</li>
                  <li>Update your cause with new information</li>
                </ul>
              `
                  : `
                <p>Your cause needs some updates before it can be published. Please review the feedback and make the necessary changes.</p>
                <p>Once you've addressed the feedback, you can resubmit your cause for review.</p>
              `
              }

              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.causeUrl}" class="button">View Your Cause</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for making a difference in your community!</p>
              <p>&copy; 2025 Hands2gether. Building stronger communities together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  accountStatusUpdate: {
    subject: (status: string) => `Your account status has been updated 👤`,
    html: (data: { userName: string; status: string; reason?: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Status Update</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .header-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .status-box { background: #f0f9ff; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 24px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">👤</div>
              <div class="header-title">Account Status Update</div>
              <p>Your account status has been updated</p>
            </div>
            <div class="content">
              <h1>Hi ${data.userName},</h1>
              <p>We wanted to inform you about a change to your account status.</p>
              
              <div class="status-box">
                <p><strong>Account Status:</strong> ${data.status.toUpperCase()}</p>
                ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
              </div>

              <p>If you have any questions about this change, please don't hesitate to contact our support team.</p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}" class="button">Visit Your Account</a>
              </div>
            </div>
            <div class="footer">
              <p>If you have any concerns, please contact our support team.</p>
              <p>&copy; 2025 Hands2gether. Building stronger communities together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  commentModeration: {
    subject: (action: string) => `Your comment has been ${action} 💬`,
    html: (data: {
      userName: string;
      action: string;
      causeTitle: string;
      comment: string;
      reason?: string;
      causeUrl: string;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Comment ${data.action}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: ${data.action === "approved" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"}; padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 48px; margin-bottom: 16px; }
            .header-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .comment-box { background: #f8fafc; border-left: 4px solid ${data.action === "approved" ? "#10b981" : "#ef4444"}; padding: 16px; margin: 24px 0; font-style: italic; }
            .button { display: inline-block; background: ${data.action === "approved" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">${data.action === "approved" ? "✅" : "❌"}</div>
              <div class="header-title">Comment ${data.action}</div>
              <p>Your comment on "${data.causeTitle}" has been ${data.action}</p>
            </div>
            <div class="content">
              <h1>Hi ${data.userName},</h1>
              <p>We wanted to update you about your recent comment.</p>
              
              <div class="comment-box">
                "${data.comment}"
              </div>

              <p><strong>Status:</strong> ${data.action.toUpperCase()}</p>
              ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}

              ${
                data.action === "approved"
                  ? `
                <p>Thank you for contributing to the community discussion! Your comment is now visible to all users.</p>
              `
                  : `
                <p>Your comment didn't meet our community guidelines. Please review our guidelines and feel free to post again following our standards.</p>
              `
              }

              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.causeUrl}" class="button">View Cause</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for being part of our community!</p>
              <p>&copy; 2025 Hands2gether. Building stronger communities together.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },
};

// Email service functions
export class EmailService {
  static async sendWelcomeEmail(userData: { name: string; email: string }) {
    try {
      const template = EMAIL_TEMPLATES.welcome;

      const mailOptions = {
        from: `"Hands2gether" <${process.env.SMTP_USER}>`,
        to: userData.email,
        subject: template.subject,
        html: template.html(userData),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Welcome email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error);
      return { success: false, error };
    }
  }

  static async sendSupportConfirmation(data: {
    supporterName: string;
    supporterEmail: string;
    causeName: string;
    amount: number;
    message?: string;
    creatorName: string;
    causeId: number;
  }) {
    try {
      const template = EMAIL_TEMPLATES.causeSupport;
      const causeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes/${data.causeId}`;

      const mailOptions = {
        from: `"Hands2gether" <${process.env.SMTP_USER}>`,
        to: data.supporterEmail,
        subject: template.subject.replace("{causeName}", data.causeName),
        html: template.html({
          ...data,
          causeUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Support confirmation email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send support confirmation email:", error);
      return { success: false, error };
    }
  }

  static async sendCommentNotification(data: {
    creatorName: string;
    creatorEmail: string;
    causeName: string;
    commenterName: string;
    comment: string;
    causeId: number;
  }) {
    try {
      const template = EMAIL_TEMPLATES.newComment;
      const causeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes/${data.causeId}`;

      const mailOptions = {
        from: `"Hands2gether" <${process.env.SMTP_USER}>`,
        to: data.creatorEmail,
        subject: template.subject.replace("{causeName}", data.causeName),
        html: template.html({
          ...data,
          causeUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Comment notification email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send comment notification email:", error);
      return { success: false, error };
    }
  }

  // Send enrollment confirmation email to student
  static async sendEnrollmentConfirmation({
    studentName,
    studentEmail,
    courseName,
    instructorName,
    startDate,
    endDate,
    courseId,
  }: {
    studentName: string;
    studentEmail: string;
    courseName: string;
    instructorName: string;
    startDate: string;
    endDate: string;
    courseId: number;
  }) {
    try {
      const mailOptions = {
        from: `"Hands2gether Education" <${process.env.SMTP_USER}>`,
        to: studentEmail,
        subject: `✅ Enrollment Confirmed: ${courseName}`,
        html: EMAIL_TEMPLATES.enrollmentConfirmation.html({
          studentName,
          courseName,
          instructorName,
          startDate,
          endDate,
          courseId,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Enrollment confirmation email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send enrollment confirmation email:", error);
      return { success: false, error };
    }
  }

  // Send new enrollment notification to instructor
  static async sendNewEnrollmentNotification({
    instructorName,
    instructorEmail,
    studentName,
    courseName,
    enrollmentDate,
    courseId,
  }: {
    instructorName: string;
    instructorEmail: string;
    studentName: string;
    courseName: string;
    enrollmentDate: string;
    courseId: number;
  }) {
    try {
      const mailOptions = {
        from: `"Hands2gether Education" <${process.env.SMTP_USER}>`,
        to: instructorEmail,
        subject: `📚 New Student Enrolled: ${courseName}`,
        html: EMAIL_TEMPLATES.newEnrollmentNotification.html({
          instructorName,
          studentName,
          courseName,
          enrollmentDate,
          courseId,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(
        "✅ New enrollment notification email sent:",
        result.messageId,
      );
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(
        "❌ Failed to send new enrollment notification email:",
        error,
      );
      return { success: false, error };
    }
  }

  // Send email verification email
  static async sendEmailVerificationEmail(userData: {
    name: string;
    email: string;
    verificationToken: string;
    verificationUrl: string;
  }) {
    try {
      const template = EMAIL_TEMPLATES.emailVerification;

      const mailOptions = {
        from: `"Hands2gether Team" <${process.env.SMTP_USER}>`,
        to: userData.email,
        subject: template.subject,
        html: template.html({
          name: userData.name,
          verificationUrl: userData.verificationUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Email verification email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send email verification email:", error);
      return { success: false, error };
    }
  }

  // Send cause status update email
  static async sendCauseStatusUpdateEmail(userData: {
    userName: string;
    userEmail: string;
    causeTitle: string;
    status: "approved" | "rejected";
    reason?: string;
    causeUrl: string;
  }) {
    try {
      const template = EMAIL_TEMPLATES.causeStatusUpdate;

      const mailOptions = {
        from: `"Hands2gether Admin" <${process.env.SMTP_USER}>`,
        to: userData.userEmail,
        subject: template.subject(userData.status),
        html: template.html({
          userName: userData.userName,
          causeTitle: userData.causeTitle,
          status: userData.status,
          reason: userData.reason,
          causeUrl: userData.causeUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Cause status update email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send cause status update email:", error);
      return { success: false, error };
    }
  }

  // Send account status update email
  static async sendAccountStatusUpdateEmail(userData: {
    userName: string;
    userEmail: string;
    status: string;
    reason?: string;
  }) {
    try {
      const template = EMAIL_TEMPLATES.accountStatusUpdate;

      const mailOptions = {
        from: `"Hands2gether Admin" <${process.env.SMTP_USER}>`,
        to: userData.userEmail,
        subject: template.subject(userData.status),
        html: template.html({
          userName: userData.userName,
          status: userData.status,
          reason: userData.reason,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Account status update email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send account status update email:", error);
      return { success: false, error };
    }
  }

  // Send comment moderation email
  static async sendCommentModerationEmail(userData: {
    userName: string;
    userEmail: string;
    action: "approved" | "rejected";
    causeTitle: string;
    comment: string;
    reason?: string;
    causeUrl: string;
  }) {
    try {
      const template = EMAIL_TEMPLATES.commentModeration;

      const mailOptions = {
        from: `"Hands2gether Moderation" <${process.env.SMTP_USER}>`,
        to: userData.userEmail,
        subject: template.subject(userData.action),
        html: template.html({
          userName: userData.userName,
          action: userData.action,
          causeTitle: userData.causeTitle,
          comment: userData.comment,
          reason: userData.reason,
          causeUrl: userData.causeUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Comment moderation email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send comment moderation email:", error);
      return { success: false, error };
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(userData: {
    name: string;
    email: string;
    resetToken: string;
    resetUrl: string;
  }) {
    try {
      const template = EMAIL_TEMPLATES.passwordReset;

      const mailOptions = {
        from: `"Hands2gether Security" <${process.env.SMTP_USER}>`,
        to: userData.email,
        subject: template.subject,
        html: template.html({
          name: userData.name,
          resetUrl: userData.resetUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Password reset email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);
      return { success: false, error };
    }
  }

  // Test email function
  static async sendTestEmail(toEmail: string) {
    try {
      const mailOptions = {
        from: `"Hands2gether Test" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "Test Email from Hands2gether",
        html: `
          <h2>🎉 Email Configuration Test</h2>
          <p>If you're reading this, the email service is working correctly!</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> Hands2gether Email Service</p>
        `,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Test email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send test email:", error);
      return { success: false, error };
    }
  }

  // Generic email sending method
  static async sendEmail(mailOptions: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const options = {
        from: mailOptions.from || `"Hands2gether" <${process.env.SMTP_USER}>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
      };

      const result = await transporter.sendMail(options);
      console.log("✅ Email sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return { success: false, error };
    }
  }

  // Send new comment notification to cause creator
  static async sendNewCommentEmail(data: {
    creatorName: string;
    creatorEmail: string;
    causeName: string;
    commenterName: string;
    comment: string;
    causeId: number;
  }) {
    try {
      const template = EMAIL_TEMPLATES.newComment;
      const causeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes/${data.causeId}`;

      const mailOptions = {
        from: `"Hands2gether" <${process.env.SMTP_USER}>`,
        to: data.creatorEmail,
        subject: template.subject.replace("{causeName}", data.causeName),
        html: template.html({
          ...data,
          causeUrl,
        }),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ New comment notification email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send new comment notification email:", error);
      return { success: false, error };
    }
  }

  // Send comment reply notification to all previous commenters
  static async sendCommentReplyNotifications(data: {
    causeName: string;
    commenterName: string;
    comment: string;
    causeId: number;
    recipients: Array<{ name: string; email: string; user_id: number }>;
    newCommenterId: number;
  }) {
    try {
      const causeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes/${data.causeId}`;
      const results = [];

      // Send notification to each previous commenter (except the new commenter)
      for (const recipient of data.recipients) {
        if (recipient.user_id === data.newCommenterId) {
          continue; // Don't notify the person who just commented
        }

        const mailOptions = {
          from: `"Hands2gether" <${process.env.SMTP_USER}>`,
          to: recipient.email,
          subject: `New comment on "${data.causeName}" - Join the conversation!`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Comment - Join the Conversation</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
                  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                  .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center; color: white; }
                  .header-icon { font-size: 48px; margin-bottom: 16px; }
                  .content { padding: 40px 30px; }
                  .comment-box { background: #f1f5f9; border-left: 4px solid #6366f1; padding: 20px; border-radius: 8px; margin: 24px 0; }
                  .commenter { font-weight: 600; color: #1e293b; margin-bottom: 8px; }
                  .comment-text { font-style: italic; line-height: 1.6; color: #475569; }
                  .cause-name { font-size: 20px; font-weight: 700; color: #1e293b; margin: 24px 0 12px; }
                  .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
                  .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
                  .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 16px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="header-icon">💬</div>
                    <div>New Comment - Join the Conversation!</div>
                  </div>
                  <div class="content">
                    <h1>Hi ${recipient.name},</h1>
                    <p>There's a new comment on a cause you've been following! Someone just joined the conversation.</p>
                    
                    <div class="cause-name">${data.causeName}</div>
                    
                    <div class="comment-box">
                      <div class="commenter">${data.commenterName} wrote:</div>
                      <div class="comment-text">"${data.comment.length > 200 ? data.comment.substring(0, 200) + "..." : data.comment}"</div>
                    </div>

                    <p>Since you've commented on this cause before, we thought you'd be interested in this new perspective. Feel free to join the discussion!</p>
                    
                    <a href="${causeUrl}" class="button">View Full Conversation</a>
                    
                    <div class="unsubscribe">
                      <p><small>You're receiving this because you commented on this cause. Visit your <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/profile/settings">notification settings</a> to customize these emails.</small></p>
                    </div>
                  </div>
                  <div class="footer">
                    <p>Keep the conversation going and help build a stronger community!</p>
                    <p>&copy; 2025 Hands2gether. Making the world a better place, together.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        };

        try {
          const result = await transporter.sendMail(mailOptions);
          results.push({
            email: recipient.email,
            success: true,
            messageId: result.messageId,
          });
          console.log(
            `✅ Comment reply notification sent to ${recipient.email}:`,
            result.messageId,
          );
        } catch (error) {
          results.push({
            email: recipient.email,
            success: false,
            error: error,
          });
          console.error(
            `❌ Failed to send comment reply notification to ${recipient.email}:`,
            error,
          );
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error("❌ Failed to send comment reply notifications:", error);
      return { success: false, error };
    }
  }
}

export default EmailService;
