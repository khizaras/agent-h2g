import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      whereClause += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status && status !== "all") {
      if (status === "banned") {
        whereClause += " AND is_verified = FALSE AND last_login < DATE_SUB(NOW(), INTERVAL 90 DAY)";
      } else if (status === "active") {
        whereClause += " AND is_verified = TRUE AND last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      } else if (status === "inactive") {
        whereClause += " AND (is_verified = FALSE OR last_login < DATE_SUB(NOW(), INTERVAL 30 DAY))";
      }
    }

    // Get users with cause statistics
    const usersQuery = `
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
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      ${whereClause}
    `;

    const [users, countResult] = await Promise.all([
      Database.query(usersQuery, [...params, limit, offset]),
      Database.query(countQuery, params),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { name, email, password, phone, is_admin, is_verified } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Database.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password, phone, is_admin, is_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await Database.query(insertQuery, [
      name,
      email,
      hashedPassword,
      phone || null,
      is_admin || false,
      is_verified || false,
    ]);

    return NextResponse.json({
      success: true,
      data: { id: result.insertId, message: "User created successfully" },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}