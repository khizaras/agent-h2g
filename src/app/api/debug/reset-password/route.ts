import { NextResponse } from "next/server";
import { Database } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword, confirmReset } = body;

    console.log("🔄 Password reset request for:", email);

    if (!email || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and new password required",
        },
        { status: 400 },
      );
    }

    if (!confirmReset) {
      return NextResponse.json(
        {
          success: false,
          error: "Must confirm reset by setting confirmReset: true",
        },
        { status: 400 },
      );
    }

    // Find user
    const result = (await Database.query(
      "SELECT id, email, name FROM users WHERE LOWER(email) = LOWER(?)",
      [email],
    )) as any[];

    const user = result[0];

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    console.log("🔐 Hashing new password...");
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await Database.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, user.id],
    );

    console.log("✅ Password updated successfully");

    // Test the new password
    const testResult = await bcrypt.compare(newPassword, hashedPassword);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        passwordUpdated: true,
        hashTest: testResult,
        hashInfo: {
          saltRounds,
          hashLength: hashedPassword.length,
          hashPrefix: hashedPassword.substring(0, 10) + "...",
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 Password reset error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "Password reset endpoint - use POST with { email, newPassword, confirmReset: true }",
    warning:
      "This endpoint should only be used for debugging in development/testing",
  });
}
