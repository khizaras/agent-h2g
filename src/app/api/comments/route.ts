import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cause_id = searchParams.get("cause_id");
    const parent_id = searchParams.get("parent_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!cause_id) {
      return NextResponse.json(
        { success: false, error: "cause_id is required" },
        { status: 400 },
      );
    }

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE c.cause_id = ? AND c.is_approved = 1";
    const params: any[] = [cause_id];

    if (parent_id) {
      whereClause += " AND c.parent_id = ?";
      params.push(parent_id);
    } else {
      whereClause += " AND c.parent_id IS NULL";
    }

    // Get comments with user information
    const commentsQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.avatar as user_avatar,
        COALESCE(reply_count.total, 0) as reply_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT parent_id, COUNT(*) as total 
        FROM comments 
        WHERE is_approved = 1
        GROUP BY parent_id
      ) reply_count ON c.id = reply_count.parent_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM comments c
      ${whereClause}
    `;

    const [comments, countResult] = (await Promise.all([
      Database.query(commentsQuery, [...params, limit, offset]),
      Database.query(countQuery, params),
    ])) as [any[], any[]];

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
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const {
      cause_id,
      parent_id,
      content,
    } = await request.json();

    // Validate required fields
    if (!cause_id || !content) {
      return NextResponse.json(
        { success: false, error: "cause_id and content are required" },
        { status: 400 },
      );
    }

    // Verify cause exists
    const causeExists = (await Database.query(
      "SELECT id FROM causes WHERE id = ?",
      [cause_id],
    )) as any[];

    if (causeExists.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cause not found" },
        { status: 404 },
      );
    }

    // If replying to a comment, verify parent exists
    if (parent_id) {
      const parentExists = (await Database.query(
        "SELECT id FROM comments WHERE id = ? AND cause_id = ?",
        [parent_id, cause_id],
      )) as any[];

      if (parentExists.length === 0) {
        return NextResponse.json(
          { success: false, error: "Parent comment not found" },
          { status: 404 },
        );
      }
    }

    // Insert new comment
    const insertQuery = `
      INSERT INTO comments (
        cause_id, user_id, parent_id, content, is_approved
      )
      VALUES (?, ?, ?, ?, 1)
    `;

    const result = (await Database.query(insertQuery, [
      cause_id,
      session.user.id,
      parent_id || null,
      content,
    ])) as any;

    // Update comment count for the cause
    await Database.query(
      "UPDATE causes SET comment_count = comment_count + 1 WHERE id = ?",
      [cause_id],
    );

    // Get the created comment with user information
    const newComment = (await Database.query(
      `
      SELECT 
        c.*,
        u.name as user_name,
        u.avatar as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `,
      [result.insertId],
    )) as any[];

    return NextResponse.json({
      success: true,
      data: {
        comment: newComment[0],
        message: "Comment added successfully",
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
