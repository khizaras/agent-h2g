import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🌐 Environment debug endpoint called");

    // All environment variables (safe ones)
    const envVars = {
      // Database
      DB_HOST: process.env.DB_HOST || "NOT SET",
      DB_NAME: process.env.DB_NAME || "NOT SET",
      DB_PORT: process.env.DB_PORT || "NOT SET",
      DB_USER: process.env.DB_USER || "NOT SET",
      DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "NOT SET",

      // NextAuth
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",

      // Node
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
      PORT: process.env.PORT || "NOT SET",
      HOSTNAME: process.env.HOSTNAME || "NOT SET",

      // Other
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? "SET" : "NOT SET",

      // Check if we're in production
      isProduction: process.env.NODE_ENV === "production",
    };

    console.log("🔧 Environment variables:", envVars);

    // System info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    console.log("💻 System info:", systemInfo);

    return NextResponse.json({
      success: true,
      data: {
        envVars,
        systemInfo,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 Environment debug error:", error);

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
