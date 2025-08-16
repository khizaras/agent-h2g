import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import { EmailService } from "@/lib/email";

const enrollmentSchema = z.object({
  message: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    console.log("🔄 Enrollment request started");

    const session = await auth();
    if (!session?.user) {
      console.log("❌ No session or user found");
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    console.log("✅ User authenticated:", session.user.email);

    // Safely parse JSON body (it might be empty)
    let body = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (error) {
      // If no body or invalid JSON, use empty object
      body = {};
    }
    const validatedData = enrollmentSchema.parse(body);
    const resolvedParams = await params;
    const causeId = parseInt(resolvedParams.id);

    console.log("📋 Request data:", { causeId, validatedData });

    if (isNaN(causeId)) {
      console.log("❌ Invalid cause ID:", resolvedParams.id);
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

    console.log("🔍 Database query result:", {
      causeId,
      foundCauses: causes.length,
      causes: causes.length > 0 ? causes[0] : null,
    });

    if (!causes || causes.length === 0) {
      console.log("❌ Training cause not found for ID:", causeId);
      return NextResponse.json(
        { success: false, message: "Training cause not found" },
        { status: 404 },
      );
    }

    const course = causes[0];

    // Check enrollment eligibility
    const today = new Date();

    console.log("📅 Enrollment eligibility check:", {
      today: today.toISOString(),
      registrationDeadline: course.registration_deadline,
      startDate: course.start_date,
      currentParticipants: course.current_participants,
      maxParticipants: course.max_participants,
    });

    // Check if registration deadline has passed
    if (
      course.registration_deadline &&
      new Date(course.registration_deadline) < today
    ) {
      console.log("❌ Registration deadline has passed");
      return NextResponse.json(
        { success: false, message: "Registration deadline has passed" },
        { status: 400 },
      );
    }

    // Check if course has already started (allow enrollment on the same day)
    const courseStartDate = new Date(course.start_date);
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const courseStartDateOnly = new Date(
      courseStartDate.getFullYear(),
      courseStartDate.getMonth(),
      courseStartDate.getDate(),
    );

    if (courseStartDateOnly < todayDateOnly) {
      console.log("❌ Course has already started");
      return NextResponse.json(
        { success: false, message: "Course has already started" },
        { status: 400 },
      );
    }

    // Check if course is full
    if (course.current_participants >= course.max_participants) {
      console.log("❌ Course is full");
      return NextResponse.json(
        { success: false, message: "Course is full" },
        { status: 400 },
      );
    }

    // Check if user is already enrolled
    const existingEnrollments = (await Database.query(
      "SELECT id FROM training_enrollments WHERE training_id = (SELECT id FROM training_details WHERE cause_id = ?) AND user_id = ?",
      [causeId, session.user.id],
    )) as any[];

    console.log("👥 Existing enrollments check:", {
      userId: session.user.id,
      causeId,
      existingEnrollments: existingEnrollments.length,
    });

    if (existingEnrollments.length > 0) {
      console.log("❌ User already enrolled");
      return NextResponse.json(
        { success: false, message: "You are already enrolled in this course" },
        { status: 400 },
      );
    }

    // Create enrollment record
    const enrollmentResult = (await Database.query(
      `INSERT INTO training_enrollments (training_id, user_id, status, enrollment_date) 
       VALUES ((SELECT id FROM training_details WHERE cause_id = ?), ?, 'pending', NOW())`,
      [causeId, session.user.id],
    )) as any;

    console.log("✅ Enrollment created:", {
      enrollmentId: enrollmentResult.insertId,
      userId: session.user.id,
      causeId,
    });

    // Update current participants count
    await Database.query(
      "UPDATE training_details SET current_participants = current_participants + 1 WHERE cause_id = ?",
      [causeId],
    );

    // Send enrollment confirmation emails (non-blocking)
    try {
      // Send confirmation to student
      await EmailService.sendEnrollmentConfirmation({
        studentName: session.user.name || "Student",
        studentEmail: session.user.email || "",
        courseName: course.title,
        instructorName: course.instructor_name,
        startDate: new Date(course.start_date).toLocaleDateString(),
        endDate: new Date(course.end_date).toLocaleDateString(),
        courseId: causeId,
      });

      // Send notification to instructor
      if (course.instructor_email) {
        await EmailService.sendNewEnrollmentNotification({
          instructorName: course.instructor_name,
          instructorEmail: course.instructor_email,
          studentName: session.user.name || "Student",
          courseName: course.title,
          enrollmentDate: new Date().toISOString(),
          courseId: causeId,
        });
      }

      console.log("✅ Enrollment emails sent successfully");
    } catch (emailError) {
      console.error(
        "⚠️ Failed to send enrollment emails (non-blocking):",
        emailError,
      );
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
      `SELECT te.*, td.max_participants, td.current_participants, td.registration_deadline, td.start_date
       FROM training_enrollments te
       INNER JOIN training_details td ON te.training_id = td.id
       WHERE td.cause_id = ? AND te.user_id = ?`,
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
