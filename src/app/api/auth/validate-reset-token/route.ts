import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Database } from "@/lib/database";

const validateTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = validateTokenSchema.parse(body);

    // Check if token exists and is not expired
    const result = (await Database.query(
      `SELECT id, name, email, password_reset_expires 
       FROM users 
       WHERE password_reset_token = ? AND password_reset_expires > NOW()`,
      [validatedData.token]
    )) as any[];

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token. Please request a new password reset.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reset token is valid",
    });
  } catch (error) {
    console.error("Validate reset token error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token format",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "auth/validate-reset-token",
    timestamp: new Date().toISOString(),
  });
}