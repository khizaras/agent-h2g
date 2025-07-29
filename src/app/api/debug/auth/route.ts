import { NextResponse } from "next/server";
import { UserService } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("🔐 Auth debug endpoint called");
    console.log("📧 Testing email:", email);
    console.log("🔑 Password provided:", !!password);

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password required",
        },
        { status: 400 },
      );
    }

    // Step 1: Find user
    console.log("🔍 Step 1: Finding user...");
    const user = await UserService.findByEmail(email);
    console.log("👤 User found:", !!user);

    if (!user) {
      return NextResponse.json({
        success: false,
        step: "user_lookup",
        message: "User not found",
      });
    }

    // Step 2: Check password
    console.log("🔐 Step 2: Checking password...");
    console.log("🔑 User has password:", !!user.password);

    if (!user.password) {
      return NextResponse.json({
        success: false,
        step: "password_check",
        message: "User has no password set",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password valid:", isPasswordValid);

    return NextResponse.json({
      success: true,
      data: {
        userFound: true,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        hasPassword: !!user.password,
        passwordValid: isPasswordValid,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 Auth debug error:", error);

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
    message: "Auth debug endpoint - use POST with { email, password }",
  });
}
