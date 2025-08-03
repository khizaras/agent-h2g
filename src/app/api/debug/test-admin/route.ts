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

    console.log("Testing admin users query...");

    // Test the exact query from admin users API
    const usersQuery = `
      SELECT 
        u.*,
        COUNT(DISTINCT c.id) as causesCreated,
        COALESCE(SUM(c.like_count), 0) as totalRaised,
        CASE 
          WHEN is_active = FALSE THEN 'banned'
          WHEN email_verified = TRUE AND is_active = TRUE THEN 'active'
          ELSE 'inactive'
        END as status
      FROM users u
      LEFT JOIN causes c ON u.id = c.user_id
      WHERE 1=1
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT 50
    `;

    console.log("Executing query:", usersQuery);
    const users = await Database.query(usersQuery, []);
    console.log("Query result:", users);

    return NextResponse.json({
      success: true,
      data: { users, count: users.length }
    });
  } catch (error) {
    console.error("Error testing admin query:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}