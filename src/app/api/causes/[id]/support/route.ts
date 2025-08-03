import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import { EmailService } from "@/lib/email";

const supportSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  message: z.string().optional(),
  anonymous: z.boolean().default(false),
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
    const validatedData = supportSchema.parse(body);
    const resolvedParams = await params;
    const causeId = parseInt(resolvedParams.id);

    if (isNaN(causeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid cause ID" },
        { status: 400 },
      );
    }

    // Check if cause exists
    const causes = (await Database.query(
      "SELECT id, title, user_id FROM causes WHERE id = ?",
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cause not found" },
        { status: 404 },
      );
    }

    const cause = causes[0];

    // Create support record
    const result = (await Database.query(
      `INSERT INTO cause_supporters 
       (cause_id, user_id, amount, message, anonymous, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        causeId,
        session.user.id,
        validatedData.amount,
        validatedData.message || null,
        validatedData.anonymous,
      ],
    )) as any;

    // Update cause raised amount using stored procedure
    await Database.query("CALL UpdateCauseAmounts(?)", [causeId]);

    // Get updated cause data
    const updatedCauses = (await Database.query(
      "SELECT raised_amount, supporter_count FROM causes WHERE id = ?",
      [causeId],
    )) as any[];

    // Get supporter info for response
    const supporters = (await Database.query(
      `SELECT cs.*, u.name, u.avatar 
       FROM cause_supporters cs 
       LEFT JOIN users u ON cs.user_id = u.id 
       WHERE cs.id = ?`,
      [result.insertId],
    )) as any[];

    const supporter = supporters[0];

    // Send support confirmation email (don't block the response)
    if (!validatedData.anonymous) {
      // Get supporter and creator details for email
      const [supporterDetails] = (await Database.query(
        "SELECT name, email FROM users WHERE id = ?",
        [session.user.id],
      )) as any[];

      const [creatorDetails] = (await Database.query(
        "SELECT u.name, u.email FROM users u INNER JOIN causes c ON u.id = c.user_id WHERE c.id = ?",
        [causeId],
      )) as any[];

      if (supporterDetails[0] && creatorDetails[0]) {
        EmailService.sendSupportConfirmation({
          supporterName: supporterDetails[0].name,
          supporterEmail: supporterDetails[0].email,
          causeName: cause.title,
          amount: validatedData.amount,
          message: validatedData.message,
          creatorName: creatorDetails[0].name,
          causeId: causeId,
        }).catch((error) => {
          console.error(
            "Support confirmation email failed (non-blocking):",
            error,
          );
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Support added successfully!",
      data: {
        supportId: result.insertId,
        newRaisedAmount: updatedCauses[0].raised_amount,
        newSupporterCount: updatedCauses[0].supporter_count,
        supporter: {
          id: supporter.id,
          name: validatedData.anonymous ? "Anonymous" : supporter.name,
          amount: supporter.amount,
          message: supporter.message,
          date: supporter.created_at,
          anonymous: supporter.anonymous,
        },
      },
    });
  } catch (error) {
    console.error("Support cause error:", error);

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

// Get supporters for a cause
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const causeId = parseInt(params.id);

    if (isNaN(causeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid cause ID" },
        { status: 400 },
      );
    }

    const supporters = (await Database.query(
      `SELECT cs.*, u.name, u.avatar 
       FROM cause_supporters cs 
       LEFT JOIN users u ON cs.user_id = u.id 
       WHERE cs.cause_id = ? 
       ORDER BY cs.created_at DESC 
       LIMIT 20`,
      [causeId],
    )) as any[];

    const formattedSupporters = supporters.map((supporter: any) => ({
      id: supporter.id,
      name: supporter.anonymous ? "Anonymous" : supporter.name,
      amount: supporter.amount,
      message: supporter.message,
      date: supporter.created_at,
      avatar: supporter.anonymous ? null : supporter.avatar,
      anonymous: supporter.anonymous,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSupporters,
    });
  } catch (error) {
    console.error("Get supporters error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
