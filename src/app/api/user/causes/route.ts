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
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query conditions
    const conditions = ["c.user_id = ?"];
    const params = [session.user.id];

    if (status !== "all") {
      conditions.push("c.status = ?");
      params.push(status);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    // Get user's causes
    const causesQuery = `
      SELECT 
        c.*,
        cat.name as category_name,
        cat.display_name as category_display_name,
        cat.color as category_color,
        (SELECT COUNT(*) FROM activities WHERE cause_id = c.id) as activity_count,
        (SELECT COUNT(*) FROM comments WHERE cause_id = c.id) as comment_count
      FROM causes c
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    const causes = await Database.query(causesQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM causes c
      ${whereClause}
    `;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const [countResult] = (await Database.query(countQuery, countParams)) as any[];

    // Parse JSON fields
    causes.forEach((cause: any) => {
      if (cause.tags) {
        try {
          cause.tags = JSON.parse(cause.tags);
        } catch (e) {
          cause.tags = [];
        }
      }
      if (cause.gallery) {
        try {
          cause.gallery = JSON.parse(cause.gallery);
        } catch (e) {
          cause.gallery = [];
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        causes,
        total: countResult.total,
      },
    });
  } catch (error) {
    console.error("Error fetching user causes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch causes" },
      { status: 500 }
    );
  }
}