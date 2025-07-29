import { NextResponse } from "next/server";
import { Database } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log("🔍 Password debug for:", email);

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email required",
        },
        { status: 400 },
      );
    }

    // Get user from database
    const result = (await Database.query(
      "SELECT id, email, name, password, LENGTH(password) as password_length FROM users WHERE LOWER(email) = LOWER(?)",
      [email],
    )) as any[];

    const user = result[0];

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // Analyze the stored password
    const passwordInfo = {
      hasPassword: !!user.password,
      passwordLength: user.password_length,
      passwordPrefix: user.password
        ? user.password.substring(0, 10) + "..."
        : null,
      isBcryptHash: user.password
        ? user.password.startsWith("$2a$") ||
          user.password.startsWith("$2b$") ||
          user.password.startsWith("$2y$")
        : false,
      bcryptRounds: null as number | null,
    };

    // Extract bcrypt rounds if it's a bcrypt hash
    if (passwordInfo.isBcryptHash && user.password) {
      const parts = user.password.split("$");
      if (parts.length >= 3) {
        passwordInfo.bcryptRounds = parseInt(parts[2], 10);
      }
    }

    // Test with common development passwords
    const testPasswords = [
      "admin",
      "password",
      "admin123",
      "123456",
      "hands2gether",
    ];
    const testResults: Record<string, boolean | string> = {};

    if (user.password) {
      for (const testPwd of testPasswords) {
        try {
          const isValid = await bcrypt.compare(testPwd, user.password);
          testResults[testPwd] = isValid;
          console.log(`🔑 Testing "${testPwd}": ${isValid}`);
        } catch (error) {
          testResults[testPwd] =
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        passwordInfo,
        testResults,
        bcryptInfo: {
          version: "bcryptjs",
          defaultRounds: 12,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 Password debug error:", error);

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
    message: "Password debug endpoint - use POST with { email }",
  });
}
