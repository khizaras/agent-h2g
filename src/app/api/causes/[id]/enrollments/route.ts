import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

// Get enrolled users for a cause
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const resolvedParams = await params;
    const causeId = parseInt(resolvedParams.id);

    if (isNaN(causeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid cause ID" },
        { status: 400 },
      );
    }

    // Check if cause exists and is a training course
    const causes = (await Database.query(
      `SELECT c.id, c.title, c.category_id, c.user_id 
       FROM causes c 
       WHERE c.id = ? AND c.category_id = (SELECT id FROM categories WHERE name = 'training')`,
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Training cause not found" },
        { status: 404 },
      );
    }

    const cause = causes[0];

    // Only allow the course creator to view enrolled users list
    if (cause.user_id !== parseInt(session.user.id)) {
      // For other users, just return the count
      const enrollmentCount = (await Database.query(
        `SELECT COUNT(*) as count 
         FROM training_enrollments te
         INNER JOIN training_details td ON te.training_id = td.id
         WHERE td.cause_id = ? AND te.status IN ('pending', 'approved')`,
        [causeId],
      )) as any[];

      return NextResponse.json({
        success: true,
        data: {
          canViewDetails: false,
          totalEnrollments: enrollmentCount[0]?.count || 0,
          enrollments: [],
          message: "Only the course creator can view enrolled users details",
        },
      });
    }

    // Get all enrolled users with their details
    const enrollments = (await Database.query(
      `SELECT 
         te.id as enrollment_id,
         te.status as enrollment_status,
         te.notes as message,
         te.notes,
         te.created_at as enrollment_date,
         u.id as user_id,
         u.name,
         u.email,
         u.bio,
         u.avatar,
         u.created_at as user_since
       FROM training_enrollments te
       INNER JOIN training_details td ON te.training_id = td.id
       INNER JOIN users u ON te.user_id = u.id
       WHERE td.cause_id = ? 
       ORDER BY te.created_at DESC`,
      [causeId],
    )) as any[];

    // Get course statistics
    const stats = (await Database.query(
      `SELECT 
         td.max_participants,
         td.current_participants,
         COUNT(te.id) as total_enrollments,
         SUM(CASE WHEN te.status = 'approved' THEN 1 ELSE 0 END) as accepted_count,
         SUM(CASE WHEN te.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
         SUM(CASE WHEN te.status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
       FROM training_details td
       LEFT JOIN training_enrollments te ON td.id = te.training_id
       WHERE td.cause_id = ?
       GROUP BY td.cause_id`,
      [causeId],
    )) as any[];

    const courseStats = stats[0] || {
      max_participants: 0,
      current_participants: 0,
      total_enrollments: 0,
      accepted_count: 0,
      pending_count: 0,
      rejected_count: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        canViewDetails: true,
        totalEnrollments: enrollments.length,
        stats: {
          maxParticipants: courseStats.max_participants,
          currentParticipants: courseStats.current_participants,
          totalEnrollments: courseStats.total_enrollments,
          acceptedCount: courseStats.accepted_count,
          pendingCount: courseStats.pending_count,
          rejectedCount: courseStats.rejected_count,
          availableSpots:
            courseStats.max_participants - courseStats.current_participants,
        },
        enrollments: enrollments.map((enrollment) => ({
          id: enrollment.enrollment_id,
          status: enrollment.enrollment_status,
          message: enrollment.message,
          notes: enrollment.notes,
          enrollmentDate: enrollment.enrollment_date,
          user: {
            id: enrollment.user_id,
            name: enrollment.name,
            email: enrollment.email,
            bio: enrollment.bio,
            avatar: enrollment.avatar,
            userSince: enrollment.user_since,
          },
        })),
      },
    });
  } catch (error) {
    console.error("Enrollments fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Update enrollment status (for course owners)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const causeId = parseInt(id);
    const { enrollmentId, status, notes } = await request.json();

    if (!enrollmentId || !status) {
      return NextResponse.json(
        { error: "Enrollment ID and status are required" },
        { status: 400 },
      );
    }

    // Check if user owns the cause (only cause owner can update enrollment status)
    const causeOwnerCheck = (await Database.query(
      "SELECT user_id FROM causes WHERE id = ?",
      [causeId],
    )) as any[];

    if (
      causeOwnerCheck.length === 0 ||
      causeOwnerCheck[0].user_id !== parseInt(session.user.id)
    ) {
      return NextResponse.json(
        { error: "Only the cause owner can update enrollment status" },
        { status: 403 },
      );
    }

    // Update enrollment status
    await Database.query(
      `UPDATE enrollments 
       SET enrollment_status = ?, notes = ?, updated_at = NOW()
       WHERE id = ? AND cause_id = ?`,
      [status, notes || null, enrollmentId, causeId],
    );

    // If rejected or cancelled, decrease current participants
    if (status === "rejected" || status === "cancelled") {
      await Database.query(
        "UPDATE training_details SET current_participants = GREATEST(0, current_participants - 1) WHERE cause_id = ?",
        [causeId],
      );
    }

    // Get updated enrollment
    const updatedEnrollment = (await Database.query(
      `SELECT te.*, u.name as user_name, u.email as user_email 
       FROM training_enrollments te 
       INNER JOIN training_details td ON te.training_id = td.id
       LEFT JOIN users u ON te.user_id = u.id 
       WHERE te.id = ? AND td.cause_id = ?`,
      [enrollmentId, causeId],
    )) as any[];

    return NextResponse.json({
      success: true,
      data: {
        enrollment: updatedEnrollment[0],
        message: "Enrollment status updated successfully",
      },
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update enrollment",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
