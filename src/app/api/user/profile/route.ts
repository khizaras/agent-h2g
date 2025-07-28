import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, bio, phone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Update user profile in database
    const updateQuery = `
      UPDATE users 
      SET 
        name = ?,
        email = ?,
        bio = ?,
        phone = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await Database.query(updateQuery, [
      name,
      email,
      bio || null,
      phone || null,
      session.user.id,
    ]);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}