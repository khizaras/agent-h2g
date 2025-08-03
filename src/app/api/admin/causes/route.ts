import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      whereClause += " AND (c.title LIKE ? OR c.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status && status !== "all") {
      whereClause += " AND c.status = ?";
      params.push(status);
    }

    if (category && category !== "all") {
      whereClause += " AND cat.name = ?";
      params.push(category);
    }

    // Get causes with user and category information
    const causesQuery = `
      SELECT 
        c.*,
        u.name as creator_name,
        u.avatar as creator_avatar,
        cat.name as category_name,
        cat.display_name as category_display_name,
        COALESCE(comment_count.total, 0) as comment_count
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN (
        SELECT cause_id, COUNT(*) as total 
        FROM comments 
        GROUP BY cause_id
      ) comment_count ON c.id = comment_count.cause_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
    `;

    const [causes, countResult] = await Promise.all([
      Database.query(causesQuery, [...params, limit, offset]),
      Database.query(countQuery, params),
    ]);

    const total = (countResult as any[])[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        causes,
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
    console.error("Error fetching admin causes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch causes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const {
      title,
      description,
      short_description,
      category_id,
      user_id,
      location,
      status = "active",
      priority = "medium",
      is_featured = false,
    } = await request.json();

    // Validate required fields
    if (!title || !description || !category_id || !user_id || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify category exists
    const categoryExists = await Database.query(
      "SELECT id FROM categories WHERE id = ?",
      [category_id],
    );

    if ((categoryExists as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 },
      );
    }

    // Verify user exists
    const userExists = await Database.query(
      "SELECT id FROM users WHERE id = ?",
      [user_id],
    );

    if ((userExists as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid user" },
        { status: 400 },
      );
    }

    // Insert new cause
    const insertQuery = `
      INSERT INTO causes (
        title, description, short_description, category_id, user_id, 
        location, status, priority, is_featured, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await Database.query(insertQuery, [
      title,
      description,
      short_description || description.substring(0, 200),
      category_id,
      user_id,
      location,
      status,
      priority,
      is_featured,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id: (result as any).insertId,
        message: "Cause created successfully",
      },
    });
  } catch (error) {
    console.error("Error creating cause:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cause" },
      { status: 500 },
    );
  }
}
