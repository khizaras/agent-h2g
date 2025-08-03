import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com", // Update with hands2gethero.org SMTP
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
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
}

export default EmailService;
