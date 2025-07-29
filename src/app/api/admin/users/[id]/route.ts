import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const userQuery = `
      SELECT 
        u.*,
        COUNT(DISTINCT c.id) as causesCreated,
        COALESCE(SUM(c.like_count), 0) as totalRaised,
        CASE 
          WHEN is_verified = FALSE AND last_login < DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 'banned'
          WHEN is_verified = TRUE AND last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'active'
          ELSE 'inactive'
        END as status
      FROM users u
      LEFT JOIN causes c ON u.id = c.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `;

    const users = await Database.query(userQuery, [id]);

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { name, email, password, phone, is_admin, is_verified } = await request.json();

    // Check if user exists
    const existingUser = await Database.query(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }

    if (email !== undefined) {
      // Check if email is already taken by another user
      const emailCheck = await Database.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, id]
      );

      if (emailCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: "Email already taken by another user" },
          { status: 400 }
        );
      }

      updates.push("email = ?");
      params.push(email);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updates.push("password = ?");
      params.push(hashedPassword);
    }

    if (phone !== undefined) {
      updates.push("phone = ?");
      params.push(phone);
    }

    if (is_admin !== undefined) {
      updates.push("is_admin = ?");
      params.push(is_admin);
    }

    if (is_verified !== undefined) {
      updates.push("is_verified = ?");
      params.push(is_verified);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push("updated_at = NOW()");
    params.push(id);

    const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await Database.query(updateQuery, params);

    return NextResponse.json({
      success: true,
      data: { message: "User updated successfully" },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if user exists
    const existingUser = await Database.query(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Don't allow deleting the last admin
    const adminCount = await Database.query(
      "SELECT COUNT(*) as count FROM users WHERE is_admin = TRUE"
    );

    const userToDelete = await Database.query(
      "SELECT is_admin FROM users WHERE id = ?",
      [id]
    );

    if (userToDelete[0]?.is_admin && adminCount[0]?.count <= 1) {
      return NextResponse.json(
        { success: false, error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }

    // Delete user (this will cascade delete related records due to foreign key constraints)
    await Database.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      data: { message: "User deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}