import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import { EmailService } from "@/lib/email";

const enrollmentSchema = z.object({
  notes: z.string().optional(),
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

    // Check if cause exists and is an education course
    const causes = (await Database.query(
      `SELECT c.id, c.title, c.user_id, ed.id as education_id, ed.max_trainees, ed.current_trainees, 
              ed.registration_deadline, ed.start_date, ed.end_date, ed.instructor_name, ed.instructor_email
       FROM causes c 
       INNER JOIN education_details ed ON c.id = ed.cause_id 
       WHERE c.id = ? AND c.category_id = (SELECT id FROM categories WHERE name = 'education')`,
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Education cause not found" },
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
    if (course.current_trainees >= course.max_trainees) {
      return NextResponse.json(
        { success: false, message: "Course is full" },
        { status: 400 },
      );
    }

    // Check if user is already enrolled
    const existingEnrollments = (await Database.query(
      "SELECT id FROM registrations WHERE education_id = ? AND user_id = ?",
      [course.education_id, session.user.id],
    )) as any[];

    if (existingEnrollments.length > 0) {
      return NextResponse.json(
        { success: false, message: "You are already enrolled in this course" },
        { status: 400 },
      );
    }

    // Create enrollment record
    const enrollmentResult = (await Database.query(
      `INSERT INTO registrations (education_id, user_id, status, notes) 
       VALUES (?, ?, 'pending', ?)`,
      [course.education_id, session.user.id, validatedData.notes || null],
    )) as any;

    // Update current trainees count
    await Database.query(
      "UPDATE education_details SET current_trainees = current_trainees + 1 WHERE id = ?",
      [course.education_id],
    );

    // Get user details for email
    const userDetails = (await Database.query(
      "SELECT name, email FROM users WHERE id = ?",
      [session.user.id],
    )) as any[];

    const user = userDetails[0];

    // Send enrollment confirmation email (non-blocking)
    if (user?.email) {
      EmailService.sendEnrollmentConfirmation({
        studentName: user.name,
        studentEmail: user.email,
        courseName: course.title,
        instructorName: course.instructor_name,
        startDate: course.start_date,
        endDate: course.end_date,
        courseId: causeId,
      }).catch((error: any) => {
        console.error(
          "Enrollment confirmation email failed (non-blocking):",
          error,
        );
      });
    }

    // Send notification to instructor (non-blocking)
    if (course.instructor_email) {
      EmailService.sendNewEnrollmentNotification({
        instructorName: course.instructor_name,
        instructorEmail: course.instructor_email,
        studentName: user.name,
        courseName: course.title,
        enrollmentDate: new Date().toISOString(),
        courseId: causeId,
      }).catch((error: any) => {
        console.error(
          "Instructor notification email failed (non-blocking):",
          error,
        );
      });
    }

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
      `SELECT r.*, ed.max_trainees, ed.current_trainees, ed.registration_deadline, ed.start_date
       FROM registrations r
       INNER JOIN education_details ed ON r.education_id = ed.id
       INNER JOIN causes c ON ed.cause_id = c.id
       WHERE c.id = ? AND r.user_id = ?`,
      [causeId, session.user.id],
    )) as any[];

    const isEnrolled = enrollments.length > 0;
    const enrollment = isEnrolled ? enrollments[0] : null;

    // Get course availability info
    const courseInfo = (await Database.query(
      `SELECT ed.max_trainees, ed.current_trainees, ed.registration_deadline, ed.start_date, ed.end_date
       FROM education_details ed
       INNER JOIN causes c ON ed.cause_id = c.id
       WHERE c.id = ?`,
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
    } else if (course.current_trainees >= course.max_trainees) {
      enrollmentStatus = "full";
    }

    return NextResponse.json({
      success: true,
      data: {
        isEnrolled,
        enrollment,
        courseInfo: {
          maxTrainees: course.max_trainees,
          currentTrainees: course.current_trainees,
          availableSpots: course.max_trainees - course.current_trainees,
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
