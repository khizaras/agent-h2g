import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserService, Database } from "@/lib/database";
import { EmailService } from "@/lib/email";
import crypto from "crypto";

const verifySchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    // Check if token exists and is not expired
    const tokenResult = (await Database.query(
      `SELECT identifier, expires FROM verificationtokens WHERE token = ? AND expires > NOW()`,
      [token],
    )) as any[];

    if (tokenResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid or expired verification token. Please request a new verification email.",
        },
        { status: 400 },
      );
    }

    const { identifier: email } = tokenResult[0];

    // Update user verification status
    const updateResult = await Database.query(
      `UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE email = ?`,
      [email],
    );

    // Remove the verification token (it can only be used once)
    await Database.query(`DELETE FROM verificationtokens WHERE token = ?`, [
      token,
    ]);

    console.log(`✅ Email verified successfully for user: ${email}`);

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully! You can now sign in to your account.",
    });
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

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Remove old verification tokens for this user
    await Database.query(
      `DELETE FROM verificationtokens WHERE identifier = ?`,
      [email],
    );

    // Store new verification token
    await Database.query(
      `INSERT INTO verificationtokens (identifier, token, expires) VALUES (?, ?, ?)`,
      [email, verificationToken, verificationTokenExpiry],
    );

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/auth/verify-email?token=${verificationToken}`;

    try {
      await EmailService.sendEmailVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken,
        verificationUrl,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully.",
    });
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
