import { NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET() {
  try {
    console.log("🔍 Database debug endpoint called");

    // Check database health
    const healthCheck = await Database.healthCheck();
    console.log("🏥 Health check result:", healthCheck);

    // Test basic query
    const testQuery = await Database.query(
      "SELECT COUNT(*) as user_count FROM users",
    );
    console.log("👥 User count query result:", testQuery);

    // Test environment variables
    const envCheck = {
      DB_HOST: process.env.DB_HOST || "NOT SET",
      DB_NAME: process.env.DB_NAME || "NOT SET",
      DB_PORT: process.env.DB_PORT || "NOT SET",
      DB_USER: process.env.DB_USER || "NOT SET",
      DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
    };
    console.log("🔧 Environment variables:", envCheck);

    return NextResponse.json({
      success: true,
      data: {
        healthCheck,
        testQuery,
        envCheck,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 Database debug error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          code: (error as any)?.code,
          errno: (error as any)?.errno,
          sqlState: (error as any)?.sqlState,
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      { status: 500 },
    );
  }
}
