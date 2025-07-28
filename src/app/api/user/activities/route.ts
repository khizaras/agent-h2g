import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get user activities with cause details
    const activitiesQuery = `
      SELECT 
        a.*,
        c.title as cause_title,
        c.image as cause_image,
        cat.display_name as category_name,
        cat.color as category_color
      FROM activities a
      LEFT JOIN causes c ON a.cause_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const activities = await Database.query(activitiesQuery, [
      session.user.id,
      limit,
      offset,
    ]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM activities
      WHERE user_id = ?
    `;
    const [countResult] = (await Database.query(countQuery, [
      session.user.id,
    ])) as any[];

    return NextResponse.json({
      success: true,
      data: {
        activities,
        total: countResult.total,
      },
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}