import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserService, Database } from "@/lib/database";

const verifySchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    // TODO: Implement email verification logic with token validation
    // For now, return a placeholder response
    return NextResponse.json(
      {
        success: false,
        message: "Email verification not yet implemented",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("Email verification error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Email verification failed" },
      { status: 500 },
    );
  }
}

// Resend verification email
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = z.object({ email: z.string().email() }).parse(body);

    const user = await UserService.findByEmail(email);

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({
        success: true,
        message:
          "If an account with this email exists, a verification email has been sent.",
      });
    }

    if (user.is_verified) {
      return NextResponse.json(
        { success: false, message: "This email is already verified." },
        { status: 400 },
      );
    }

    // TODO: Implement verification token generation and email sending
    return NextResponse.json(
      {
        success: false,
        message: "Email verification resend not yet implemented",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to resend verification email" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "auth/verify-email",
    timestamp: new Date().toISOString(),
  });
}
