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

    console.log("Testing admin comments query...");

    // Test the exact query from admin comments API
    const commentsQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.avatar as user_avatar,
        u.email_verified,
        cause.title as cause_title,
        cause.id as cause_id,
        CASE 
          WHEN c.is_approved = TRUE THEN 'approved'
          ELSE 'pending'
        END as status
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN causes cause ON c.cause_id = cause.id
      WHERE 1=1
      ORDER BY c.created_at DESC
      LIMIT 50
    `;

    console.log("Executing query:", commentsQuery);
    const comments = await Database.query(commentsQuery, []);
    console.log("Query result:", comments);

    return NextResponse.json({
      success: true,
      data: { comments, count: comments.length }
    });
  } catch (error) {
    console.error("Error testing comments query:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}