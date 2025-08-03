import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { success: false, error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Update user to admin
    const result = await Database.query(
      "UPDATE users SET role = 'admin' WHERE email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} has been made an admin`
    });
  } catch (error) {
    console.error("Error making user admin:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}