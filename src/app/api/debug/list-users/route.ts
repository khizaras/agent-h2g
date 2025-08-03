import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { success: false, error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    // Get all users
    const users = await Database.query(
      "SELECT id, name, email, role, email_verified, created_at FROM users ORDER BY id",
      []
    );

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list users" },
      { status: 500 }
    );
  }
}