import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import { z } from "zod";

const interactionSchema = z.object({
  type: z.enum(["like", "follow", "bookmark"]),
  cause_id: z.number().int().positive(),
  action: z.enum(["add", "remove"]).default("add"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = interactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { type, cause_id, action } = validation.data;
    const userId = (session.user as any).id;

    // Verify cause exists
    const cause = (await Database.query(
      "SELECT id, user_id, title FROM causes WHERE id = ? AND status = 'active'",
      [cause_id],
    )) as any[];

    if (cause.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cause not found" },
        { status: 404 },
      );
    }

    // Prevent self-interaction for certain types
    if (type === "follow" && cause[0].user_id === userId) {
      return NextResponse.json(
        { success: false, error: "Cannot follow your own cause" },
        { status: 400 },
      );
    }

    if (action === "add") {
      // Check if interaction already exists
      const existing = (await Database.query(
        "SELECT id FROM user_interactions WHERE user_id = ? AND cause_id = ? AND interaction_type = ?",
        [userId, cause_id, type],
      )) as any[];

      if (existing.length > 0) {
        return NextResponse.json({
          success: true,
          data: {
            message: `Already ${type}d this cause`,
            status: "already_exists",
            interaction_id: existing[0].id,
          },
        });
      }

      // Add new interaction
      const result = (await Database.query(
        `INSERT INTO user_interactions (
          user_id, 
          cause_id, 
          interaction_type, 
          created_at
        ) VALUES (?, ?, ?, NOW())`,
        [userId, cause_id, type],
      )) as any;

      // Update counters in causes table if needed
      if (type === "like") {
        await Database.query(
          "UPDATE causes SET likes_count = likes_count + 1 WHERE id = ?",
          [cause_id],
        );
      }

      // Create notification for cause owner (except for bookmarks)
      if (type !== "bookmark" && cause[0].user_id !== userId) {
        try {
          await Database.query(
            `INSERT INTO notifications (
              user_id, 
              title, 
              message, 
              type, 
              cause_id, 
              trigger_user_id,
              created_at
            ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [
              cause[0].user_id,
              `New ${type} on your cause`,
              `Someone ${type}d your cause "${cause[0].title}"`,
              `cause_${type}`,
              cause_id,
              userId,
            ],
          );
        } catch (notificationError) {
          console.error("Failed to create notification:", notificationError);
          // Don't fail the interaction if notification fails
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          interaction_id: result.insertId,
          message: `Successfully ${type}d the cause`,
          status: "added",
        },
      });
    } else if (action === "remove") {
      // Remove interaction
      const result = (await Database.query(
        "DELETE FROM user_interactions WHERE user_id = ? AND cause_id = ? AND interaction_type = ?",
        [userId, cause_id, type],
      )) as any;

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { success: false, error: `No ${type} found to remove` },
          { status: 404 },
        );
      }

      // Update counters in causes table if needed
      if (type === "like") {
        await Database.query(
          "UPDATE causes SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?",
          [cause_id],
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          message: `Successfully removed ${type}`,
          status: "removed",
        },
      });
    }
  } catch (error) {
    console.error("User interaction error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process interaction" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // like, follow, bookmark
    const cause_id = searchParams.get("cause_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const offset = (page - 1) * limit;
    const userId = (session.user as any).id;

    let whereClause = "WHERE ui.user_id = ?";
    const params: any[] = [userId];

    if (type) {
      whereClause += " AND ui.interaction_type = ?";
      params.push(type);
    }

    if (cause_id) {
      whereClause += " AND ui.cause_id = ?";
      params.push(parseInt(cause_id));
    }

    // Get user interactions with cause details
    const interactions = await Database.query(
      `
      SELECT 
        ui.*,
        c.title as cause_title,
        c.description as cause_description,
        c.image as cause_image,
        c.goal_amount,
        c.current_amount,
        c.status as cause_status,
        cat.name as category_name,
        cat.color as category_color,
        u.name as creator_name,
        u.avatar as creator_avatar
      FROM user_interactions ui
      LEFT JOIN causes c ON ui.cause_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY ui.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    );

    // Get total count
    const countResult = (await Database.query(
      `
      SELECT COUNT(*) as total
      FROM user_interactions ui
      ${whereClause}
    `,
      params,
    )) as any[];

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Get summary counts by type
    const summary = (await Database.query(
      `
      SELECT 
        interaction_type,
        COUNT(*) as count
      FROM user_interactions
      WHERE user_id = ?
      GROUP BY interaction_type
    `,
      [userId],
    )) as any[];

    const summaryData = {
      likes: 0,
      follows: 0,
      bookmarks: 0,
    };

    summary.forEach((item: any) => {
      if (item.interaction_type in summaryData) {
        summaryData[item.interaction_type as keyof typeof summaryData] =
          item.count;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        interactions: interactions || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        summary: summaryData,
      },
    });
  } catch (error) {
    console.error("Get user interactions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user interactions" },
      { status: 500 },
    );
  }
}
