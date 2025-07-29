import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    console.log("🔍 NextAuth debug endpoint called");

    // Check session
    const session = await auth();
    console.log("🎫 Session:", session);

    // Check environment variables for NextAuth
    const nextAuthConfig = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
    };
    console.log("🔧 NextAuth config:", nextAuthConfig);

    return NextResponse.json({
      success: true,
      data: {
        session: session || null,
        nextAuthConfig,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 NextAuth debug error:", error);

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
