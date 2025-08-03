import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserService, Database } from "@/lib/database";
import { EmailService } from "@/lib/email";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await UserService.findByEmail(validatedData.email);
    
    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If this email is registered, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await Database.query(
      `UPDATE users SET 
       password_reset_token = ?, 
       password_reset_expires = ?, 
       updated_at = NOW() 
       WHERE id = ?`,
      [resetToken, resetTokenExpiry, user.id]
    );

    // Send password reset email
    try {
      await EmailService.sendPasswordResetEmail({
        name: user.name,
        email: user.email,
        resetToken,
        resetUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/auth/reset-password?token=${resetToken}`,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Don't fail the request if email fails, log it instead
    }

    return NextResponse.json({
      success: true,
      message: "If this email is registered, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
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
    endpoint: "auth/forgot-password",
    timestamp: new Date().toISOString(),
  });
}