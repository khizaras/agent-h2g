import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread") === "true";

    const offset = (page - 1) * limit;
    const userId = (session.user as any).id;

    // Build WHERE clause
    let whereClause = "WHERE n.user_id = ?";
    const params: any[] = [userId];

    if (unreadOnly) {
      whereClause += " AND n.is_read = FALSE";
    }

    // Get notifications with pagination
    const notifications = await Database.query(
      `
      SELECT 
        n.*,
        c.title as cause_title,
        c.image as cause_image,
        u.name as trigger_user_name,
        u.avatar as trigger_user_avatar
      FROM notifications n
      LEFT JOIN causes c ON n.cause_id = c.id
      LEFT JOIN users u ON n.trigger_user_id = u.id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    );

    // Get total count
    const countResult = (await Database.query(
      `
      SELECT COUNT(*) as total
      FROM notifications n
      ${whereClause}
    `,
      params,
    )) as any[];

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Get unread count
    const unreadResult = (await Database.query(
      `
      SELECT COUNT(*) as unread
      FROM notifications
      WHERE user_id = ? AND is_read = FALSE
    `,
      [userId],
    )) as any[];

    const unreadCount = unreadResult[0]?.unread || 0;

    return NextResponse.json({
      success: true,
      data: {
        notifications: notifications || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { title, message, type, cause_id, target_user_id } =
      await request.json();

    // Validate required fields
    if (!title || !message || !type) {
      return NextResponse.json(
        { success: false, error: "Title, message, and type are required" },
        { status: 400 },
      );
    }

    const triggerUserId = (session.user as any).id;

    // Create notification
    const result = (await Database.query(
      `
      INSERT INTO notifications (
        user_id, 
        title, 
        message, 
        type, 
        cause_id, 
        trigger_user_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        target_user_id || triggerUserId,
        title,
        message,
        type,
        cause_id || null,
        triggerUserId,
      ],
    )) as any;

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        message: "Notification created successfully",
      },
    });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { action, notification_ids } = await request.json();
    const userId = (session.user as any).id;

    if (!action || !notification_ids || !Array.isArray(notification_ids)) {
      return NextResponse.json(
        {
          success: false,
          error: "Action and notification_ids array are required",
        },
        { status: 400 },
      );
    }

    let query = "";
    let params: any[] = [];

    if (action === "mark_read") {
      query = `
        UPDATE notifications 
        SET is_read = TRUE, updated_at = NOW()
        WHERE id IN (${notification_ids.map(() => "?").join(",")}) 
        AND user_id = ?
      `;
      params = [...notification_ids, userId];
    } else if (action === "mark_unread") {
      query = `
        UPDATE notifications 
        SET is_read = FALSE, updated_at = NOW()
        WHERE id IN (${notification_ids.map(() => "?").join(",")}) 
        AND user_id = ?
      `;
      params = [...notification_ids, userId];
    } else if (action === "delete") {
      query = `
        DELETE FROM notifications 
        WHERE id IN (${notification_ids.map(() => "?").join(",")}) 
        AND user_id = ?
      `;
      params = [...notification_ids, userId];
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use 'mark_read', 'mark_unread', or 'delete'",
        },
        { status: 400 },
      );
    }

    await Database.query(query, params);

    return NextResponse.json({
      success: true,
      data: {
        message: `Successfully ${action.replace("_", " ")} ${notification_ids.length} notification(s)`,
        affected: notification_ids.length,
      },
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 },
    );
  }
}
