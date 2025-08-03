import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import { EmailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { 
      enrollmentIds, 
      causeId, 
      subject, 
      message, 
      emailType = 'custom' 
    } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject and message are required" },
        { status: 400 }
      );
    }

    let whereClause = "WHERE 1=1";
    let params: any[] = [];

    // Filter by enrollment IDs or cause ID
    if (enrollmentIds && enrollmentIds.length > 0) {
      whereClause += ` AND e.id IN (${enrollmentIds.map(() => '?').join(',')})`;
      params.push(...enrollmentIds);
    } else if (causeId) {
      whereClause += " AND e.cause_id = ?";
      params.push(causeId);
    } else {
      return NextResponse.json(
        { success: false, error: "Either enrollmentIds or causeId must be provided" },
        { status: 400 }
      );
    }

    // Get enrollment details
    const enrollmentsQuery = `
      SELECT 
        e.*,
        u.name as user_name,
        u.email as user_email,
        c.title as cause_title,
        td.instructor_name,
        td.start_date,
        td.end_date,
        td.training_type
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN causes c ON e.cause_id = c.id
      LEFT JOIN training_details td ON c.id = td.cause_id
      ${whereClause}
    `;

    const enrollments = await Database.query(enrollmentsQuery, params);

    if (enrollments.length === 0) {
      return NextResponse.json(
        { success: false, error: "No enrollments found" },
        { status: 404 }
      );
    }

    const emailResults = [];

    // Send emails to all enrolled users
    for (const enrollment of enrollments) {
      try {
        let emailContent = message;
        
        // Replace placeholders in the message
        emailContent = emailContent
          .replace(/\{user_name\}/g, enrollment.user_name)
          .replace(/\{cause_title\}/g, enrollment.cause_title)
          .replace(/\{instructor_name\}/g, enrollment.instructor_name || 'Instructor')
          .replace(/\{start_date\}/g, enrollment.start_date ? new Date(enrollment.start_date).toLocaleDateString() : 'TBD')
          .replace(/\{end_date\}/g, enrollment.end_date ? new Date(enrollment.end_date).toLocaleDateString() : 'TBD')
          .replace(/\{training_type\}/g, enrollment.training_type || 'Training')
          .replace(/\{enrollment_status\}/g, enrollment.status);

        const result = await EmailService.sendEmail({
          to: enrollment.user_email,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>${subject}</title>
                <style>
                  body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                  .content { background: white; padding: 30px; border: 1px solid #e1e1e1; }
                  .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎓 ${enrollment.cause_title}</h1>
                    <p>Training Program Communication</p>
                  </div>
                  <div class="content">
                    <h2>Hello ${enrollment.user_name},</h2>
                    ${emailContent.replace(/\n/g, '<br>')}
                    
                    <div style="margin: 30px 0; padding: 20px; background: #f0f6ff; border-radius: 8px;">
                      <h3>📋 Enrollment Details</h3>
                      <p><strong>Course:</strong> ${enrollment.cause_title}</p>
                      <p><strong>Status:</strong> ${enrollment.status}</p>
                      <p><strong>Instructor:</strong> ${enrollment.instructor_name || 'TBD'}</p>
                      <p><strong>Start Date:</strong> ${enrollment.start_date ? new Date(enrollment.start_date).toLocaleDateString() : 'TBD'}</p>
                      <p><strong>End Date:</strong> ${enrollment.end_date ? new Date(enrollment.end_date).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>
                  <div class="footer">
                    <p>📧 This message was sent by Hands2gether Training Administration</p>
                    <p style="font-size: 12px; color: #666;">
                      If you have questions, please contact your instructor or our support team.
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `
        });

        emailResults.push({
          user: enrollment.user_name,
          email: enrollment.user_email,
          status: result.success ? 'sent' : 'failed',
          error: result.success ? null : result.error
        });
      } catch (error) {
        emailResults.push({
          user: enrollment.user_name,
          email: enrollment.user_email,
          status: 'failed',
          error: error.message
        });
      }
    }

    const successCount = emailResults.filter(r => r.status === 'sent').length;
    const failedCount = emailResults.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      message: `Emails sent successfully to ${successCount} users${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
      data: {
        total: emailResults.length,
        sent: successCount,
        failed: failedCount,
        results: emailResults
      }
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 500 }
    );
  }
}