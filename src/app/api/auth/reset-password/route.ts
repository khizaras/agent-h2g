import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Database } from "@/lib/database";
import bcrypt from "bcryptjs";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = resetPasswordSchema.parse(body);

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

    const user = result[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Update user password and clear reset token
    await Database.query(
      `UPDATE users SET 
       password = ?, 
       password_reset_token = NULL, 
       password_reset_expires = NULL, 
       updated_at = NOW() 
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    console.log(`✅ Password reset successful for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
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
    endpoint: "auth/reset-password",
    timestamp: new Date().toISOString(),
  });
}