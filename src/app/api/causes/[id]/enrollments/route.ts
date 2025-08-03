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

    // Check if cause exists and is an education course
    const causes = (await Database.query(
      `SELECT c.id, c.title, c.category_id, c.user_id 
       FROM causes c 
       WHERE c.id = ? AND c.category_id = (SELECT id FROM categories WHERE name = 'education')`,
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Education cause not found" },
        { status: 404 },
      );
    }

    const cause = causes[0];

    // Only allow the course creator to view enrolled users list
    if (cause.user_id !== parseInt(session.user.id)) {
      // For other users, just return the count
      const enrollmentCount = (await Database.query(
        `SELECT COUNT(*) as count 
         FROM registrations r
         INNER JOIN education_details ed ON r.education_id = ed.id
         WHERE ed.cause_id = ? AND r.status IN ('pending', 'approved')`,
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
         r.id as enrollment_id,
         r.status,
         r.notes,
         r.created_at as enrollment_date,
         u.id as user_id,
         u.name,
         u.email,
         u.bio,
         u.avatar,
         u.created_at as user_since
       FROM registrations r
       INNER JOIN education_details ed ON r.education_id = ed.id
       INNER JOIN users u ON r.user_id = u.id
       WHERE ed.cause_id = ? AND r.status IN ('pending', 'approved')
       ORDER BY r.created_at DESC`,
      [causeId],
    )) as any[];

    // Get course statistics
    const stats = (await Database.query(
      `SELECT 
         ed.max_trainees,
         ed.current_trainees,
         COUNT(r.id) as total_registrations,
         SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) as approved_count,
         SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending_count
       FROM education_details ed
       LEFT JOIN registrations r ON ed.id = r.education_id
       WHERE ed.cause_id = ?
       GROUP BY ed.id`,
      [causeId],
    )) as any[];

    const courseStats = stats[0] || {
      max_trainees: 0,
      current_trainees: 0,
      total_registrations: 0,
      approved_count: 0,
      pending_count: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        canViewDetails: true,
        totalEnrollments: enrollments.length,
        stats: {
          maxTrainees: courseStats.max_trainees,
          currentTrainees: courseStats.current_trainees,
          totalRegistrations: courseStats.total_registrations,
          approvedCount: courseStats.approved_count,
          pendingCount: courseStats.pending_count,
          availableSpots: courseStats.max_trainees - courseStats.current_trainees,
        },
        enrollments: enrollments.map((enrollment) => ({
          id: enrollment.enrollment_id,
          status: enrollment.status,
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