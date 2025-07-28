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

    // Get causes user has interacted with (likes, shares, comments, activities)
    const supportedCausesQuery = `
      SELECT DISTINCT
        c.id,
        c.title,
        c.description,
        c.short_description,
        c.image,
        c.status,
        c.priority,
        c.created_at,
        c.like_count,
        c.view_count,
        cat.name as category_name,
        cat.display_name as category_display_name,
        cat.color as category_color,
        u.name as creator_name,
        MAX(ui.created_at) as last_interaction
      FROM causes c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      INNER JOIN (
        SELECT cause_id, user_id, created_at FROM user_interactions WHERE user_id = ?
        UNION ALL
        SELECT cause_id, user_id, created_at FROM activities WHERE user_id = ?
        UNION ALL
        SELECT cause_id, user_id, created_at FROM comments WHERE user_id = ?
      ) ui ON c.id = ui.cause_id
      WHERE c.user_id != ? -- Exclude own causes
      GROUP BY c.id
      ORDER BY last_interaction DESC
      LIMIT ? OFFSET ?
    `;

    const supportedCauses = await Database.query(supportedCausesQuery, [
      session.user.id,
      session.user.id,
      session.user.id,
      session.user.id,
      limit,
      offset,
    ]);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM causes c
      INNER JOIN (
        SELECT cause_id, user_id FROM user_interactions WHERE user_id = ?
        UNION ALL
        SELECT cause_id, user_id FROM activities WHERE user_id = ?
        UNION ALL
        SELECT cause_id, user_id FROM comments WHERE user_id = ?
      ) ui ON c.id = ui.cause_id
      WHERE c.user_id != ?
    `;

    const [countResult] = (await Database.query(countQuery, [
      session.user.id,
      session.user.id,
      session.user.id,
      session.user.id,
    ])) as any[];

    // Parse JSON fields
    supportedCauses.forEach((cause: any) => {
      if (cause.tags) {
        try {
          cause.tags = JSON.parse(cause.tags);
        } catch (e) {
          cause.tags = [];
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        causes: supportedCauses,
        total: countResult.total,
      },
    });
  } catch (error) {
    console.error("Error fetching supported causes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch supported causes" },
      { status: 500 }
    );
  }
}