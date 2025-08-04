import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

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
    const flagged = searchParams.get("flagged");

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      whereClause += " AND (c.content LIKE ? OR u.name LIKE ? OR cause.title LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== "all") {
      if (status === "approved") {
        whereClause += " AND c.is_approved = TRUE";
      } else if (status === "pending") {
        whereClause += " AND c.is_approved = FALSE";
      }
    }

    if (flagged === "true") {
      whereClause += " AND c.like_count < -5"; // Using like_count as a proxy for reports
    }

    // Get comments with user and cause information
    const commentsQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.avatar as user_avatar,
        u.is_verified,
        cause.title as cause_title,
        cause.id as cause_id,
        CASE 
          WHEN c.is_approved = TRUE THEN 'approved'
          ELSE 'pending'
        END as status,
        CASE 
          WHEN c.like_count < -5 THEN TRUE
          ELSE FALSE
        END as is_flagged,
        ABS(LEAST(c.like_count, 0)) as reports_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN causes cause ON c.cause_id = cause.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN causes cause ON c.cause_id = cause.id
      ${whereClause}
    `;

    const [comments, countResult] = await Promise.all([
      Database.query(commentsQuery, [...params, limit, offset]),
      Database.query(countQuery, params),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        comments,
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
    console.error("Error fetching admin comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}