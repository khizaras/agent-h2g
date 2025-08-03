import { NextRequest, NextResponse } from "next/server";
import { EmailService, verifyEmailConnection } from "@/lib/email";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const { testType, email } = await request.json();

    switch (testType) {
      case "connection":
        const isConnected = await verifyEmailConnection();
        return NextResponse.json({
          success: isConnected,
          message: isConnected
            ? "Email server connection verified"
            : "Email server connection failed",
          timestamp: new Date().toISOString(),
        });

      case "welcome":
        if (!email) {
          return NextResponse.json(
            { success: false, message: "Email address is required" },
            { status: 400 },
          );
        }
        const welcomeResult = await EmailService.sendWelcomeEmail({
          name: session.user.name || "Test User",
          email: email,
        });
        return NextResponse.json({
          success: welcomeResult.success,
          message: welcomeResult.success
            ? "Welcome email sent successfully"
            : "Failed to send welcome email",
          messageId: welcomeResult.messageId,
        });

      case "test":
        if (!email) {
          return NextResponse.json(
            { success: false, message: "Email address is required" },
            { status: 400 },
          );
        }
        const testResult = await EmailService.sendTestEmail(email);
        return NextResponse.json({
          success: testResult.success,
          message: testResult.success
            ? "Test email sent successfully"
            : "Failed to send test email",
          messageId: testResult.messageId,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid test type. Use: connection, welcome, or test",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email Test API",
    endpoints: {
      POST: "Test email functionality",
      testTypes: ["connection", "welcome", "test"],
    },
    usage: {
      connection: "POST with { testType: 'connection' }",
      welcome: "POST with { testType: 'welcome', email: 'test@example.com' }",
      test: "POST with { testType: 'test', email: 'test@example.com' }",
    },
  });
}
