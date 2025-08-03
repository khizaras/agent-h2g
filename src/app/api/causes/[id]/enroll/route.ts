import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

const enrollmentSchema = z.object({
  message: z.string().optional(),
});

export async function POST(
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

    const body = await request.json();
    const validatedData = enrollmentSchema.parse(body);
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
      `SELECT c.id, c.title, c.user_id, td.max_participants, td.current_participants, 
              td.registration_deadline, td.start_date, td.end_date, td.instructor_name, td.instructor_email,
              cat.name as category_name
       FROM causes c 
       INNER JOIN training_details td ON c.id = td.cause_id 
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.id = ? AND cat.name = 'training'`,
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Training cause not found" },
        { status: 404 },
      );
    }

    const course = causes[0];

    // Check enrollment eligibility
    const today = new Date();

    // Check if registration deadline has passed
    if (
      course.registration_deadline &&
      new Date(course.registration_deadline) < today
    ) {
      return NextResponse.json(
        { success: false, message: "Registration deadline has passed" },
        { status: 400 },
      );
    }

    // Check if course has already started
    if (new Date(course.start_date) < today) {
      return NextResponse.json(
        { success: false, message: "Course has already started" },
        { status: 400 },
      );
    }

    // Check if course is full
    if (course.current_participants >= course.max_participants) {
      return NextResponse.json(
        { success: false, message: "Course is full" },
        { status: 400 },
      );
    }

    // Check if user is already enrolled
    const existingEnrollments = (await Database.query(
      "SELECT id FROM enrollments WHERE cause_id = ? AND user_id = ?",
      [causeId, session.user.id],
    )) as any[];

    if (existingEnrollments.length > 0) {
      return NextResponse.json(
        { success: false, message: "You are already enrolled in this course" },
        { status: 400 },
      );
    }

    // Create enrollment record
    const enrollmentResult = (await Database.query(
      `INSERT INTO enrollments (cause_id, user_id, enrollment_status, message) 
       VALUES (?, ?, 'pending', ?)`,
      [causeId, session.user.id, validatedData.message || null],
    )) as any;

    // Update current participants count
    await Database.query(
      "UPDATE training_details SET current_participants = current_participants + 1 WHERE cause_id = ?",
      [causeId],
    );

    return NextResponse.json({
      success: true,
      message: "Enrollment successful!",
      data: {
        enrollmentId: enrollmentResult.insertId,
        status: "pending",
        courseName: course.title,
        startDate: course.start_date,
        endDate: course.end_date,
        instructorName: course.instructor_name,
      },
    });
  } catch (error) {
    console.error("Enrollment error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Get user enrollment status for a course
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

    // Check enrollment status
    const enrollments = (await Database.query(
      `SELECT e.*, td.max_participants, td.current_participants, td.registration_deadline, td.start_date
       FROM enrollments e
       INNER JOIN training_details td ON e.cause_id = td.cause_id
       WHERE e.cause_id = ? AND e.user_id = ?`,
      [causeId, session.user.id],
    )) as any[];

    const isEnrolled = enrollments.length > 0;
    const enrollment = isEnrolled ? enrollments[0] : null;

    // Get course availability info
    const courseInfo = (await Database.query(
      `SELECT td.max_participants, td.current_participants, td.registration_deadline, td.start_date, td.end_date
       FROM training_details td
       WHERE td.cause_id = ?`,
      [causeId],
    )) as any[];

    if (courseInfo.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 },
      );
    }

    const course = courseInfo[0];
    const today = new Date();

    let enrollmentStatus = "available";
    if (
      course.registration_deadline &&
      new Date(course.registration_deadline) < today
    ) {
      enrollmentStatus = "expired";
    } else if (new Date(course.start_date) < today) {
      enrollmentStatus = "started";
    } else if (course.current_participants >= course.max_participants) {
      enrollmentStatus = "full";
    }

    return NextResponse.json({
      success: true,
      data: {
        isEnrolled,
        enrollment,
        courseInfo: {
          maxParticipants: course.max_participants,
          currentParticipants: course.current_participants,
          availableSpots: course.max_participants - course.current_participants,
          registrationDeadline: course.registration_deadline,
          startDate: course.start_date,
          endDate: course.end_date,
          enrollmentStatus,
        },
      },
    });
  } catch (error) {
    console.error("Enrollment status check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
