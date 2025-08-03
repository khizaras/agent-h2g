import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { EmailService } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z
    .enum(["general", "support", "partnership", "feedback", "bug_report"])
    .default("general"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { name, email, subject, message, category, priority } =
      validation.data;

    // Store contact form submission in database
    const result = (await Database.query(
      `INSERT INTO contact_submissions (
        name, 
        email, 
        subject, 
        message, 
        category, 
        priority,
        status,
        submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [name, email, subject, message, category, priority],
    )) as any;

    const submissionId = result.insertId;

    // Send confirmation email to user
    try {
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-left: 4px solid #1890ff;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We've received your message and appreciate you taking the time to reach out to us. 
              Our team will review your submission and get back to you within 24-48 hours.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Submission Details:</h3>
              <p style="margin: 8px 0;"><strong>Submission ID:</strong> #${submissionId}</p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 8px 0;"><strong>Category:</strong> ${category}</p>
              <p style="margin: 8px 0;"><strong>Priority:</strong> ${priority}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              In the meantime, feel free to explore our platform and discover amazing causes 
              happening in your community.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}" 
                 style="background: #1890ff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit Hands2gether
              </a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This is an automated message from Hands2gether. Please do not reply to this email.</p>
            <p>If you need immediate assistance, please contact us directly.</p>
          </div>
        </div>
      `;

      // Send confirmation to user
      await EmailService.sendEmail({
        to: email,
        subject: "We've received your message - Hands2gether",
        html: confirmationHtml,
      });

      // Send notification to admin team
      const adminNotificationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #722ed1; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="background: white; padding: 30px;">
            <h2 style="color: #333;">Contact Details:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Submission ID:</td>
                <td style="padding: 8px 0;">#${submissionId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                <td style="padding: 8px 0;">${subject}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Category:</td>
                <td style="padding: 8px 0;">${category}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
                <td style="padding: 8px 0;"><span style="background: ${priority === "high" ? "#ff4d4f" : priority === "medium" ? "#faad14" : "#52c41a"}; color: white; padding: 2px 8px; border-radius: 4px;">${priority}</span></td>
              </tr>
            </table>
            
            <h3 style="color: #333; margin-top: 20px;">Message:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; white-space: pre-wrap;">
${message}
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXTAUTH_URL}/admin" 
                 style="background: #722ed1; color: white; padding: 10px 20px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      `;

      // Send to admin email (you should set this in environment variables)
      const adminEmail = process.env.ADMIN_EMAIL || "admin@hands2gethero.org";
      await EmailService.sendEmail({
        to: adminEmail,
        subject: `New Contact Form: ${subject} [${category}]`,
        html: adminNotificationHtml,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation emails:", emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: submissionId,
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
        reference_id: `#${submissionId}`,
      },
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // Admin endpoint to get contact form submissions
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (status) {
      whereClause += " AND status = ?";
      params.push(status);
    }

    if (category) {
      whereClause += " AND category = ?";
      params.push(category);
    }

    // Get submissions
    const submissions = await Database.query(
      `
      SELECT 
        id,
        name,
        email,
        subject,
        category,
        priority,
        status,
        submitted_at,
        responded_at,
        LENGTH(message) as message_length
      FROM contact_submissions
      ${whereClause}
      ORDER BY submitted_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    );

    // Get total count
    const countResult = (await Database.query(
      `
      SELECT COUNT(*) as total
      FROM contact_submissions
      ${whereClause}
    `,
      params,
    )) as any[];

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        submissions: submissions || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get contact submissions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact submissions" },
      { status: 500 },
    );
  }
}
