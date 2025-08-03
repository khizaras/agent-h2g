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
    const causeId = searchParams.get("causeId");

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      whereClause += " AND (u.name LIKE ? OR u.email LIKE ? OR c.title LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== "all") {
      whereClause += " AND e.status = ?";
      params.push(status);
    }

    if (causeId) {
      whereClause += " AND e.cause_id = ?";
      params.push(causeId);
    }

    // Get enrollments with user and cause information
    const enrollmentsQuery = `
      SELECT 
        e.*,
        u.name as user_name,
        u.email as user_email,
        u.avatar as user_avatar,
        u.phone as user_phone,
        c.title as cause_title,
        c.location as cause_location,
        td.instructor_name,
        td.start_date,
        td.end_date,
        td.max_participants,
        td.current_participants,
        td.training_type,
        td.skill_level
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN causes c ON e.cause_id = c.id
      LEFT JOIN training_details td ON c.id = td.cause_id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN causes c ON e.cause_id = c.id
      ${whereClause}
    `;

    const [enrollments, countResult] = await Promise.all([
      Database.query(enrollmentsQuery, [...params, limit, offset]),
      Database.query(countQuery, params),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        enrollments,
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
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// Update enrollment status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { enrollmentId, status, adminNotes } = await request.json();

    if (!enrollmentId || !status) {
      return NextResponse.json(
        { success: false, error: "Enrollment ID and status are required" },
        { status: 400 }
      );
    }

    // Valid statuses
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update enrollment
    await Database.query(
      `UPDATE enrollments 
       SET status = ?, admin_notes = ?, updated_at = NOW() 
       WHERE id = ?`,
      [status, adminNotes || null, enrollmentId]
    );

    // If accepted, update participant count
    if (status === 'accepted') {
      await Database.query(
        `UPDATE training_details td
         JOIN enrollments e ON td.cause_id = e.cause_id
         SET td.current_participants = (
           SELECT COUNT(*) FROM enrollments 
           WHERE cause_id = e.cause_id AND status = 'accepted'
         )
         WHERE e.id = ?`,
        [enrollmentId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}