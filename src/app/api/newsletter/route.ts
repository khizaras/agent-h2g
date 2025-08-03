import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { EmailService } from "@/lib/email";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  preferences: z
    .object({
      causes: z.boolean().default(true),
      updates: z.boolean().default(true),
      weekly_digest: z.boolean().default(true),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

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

    const { email, name, preferences } = validation.data;

    // Check if email already exists
    const existingSubscriber = (await Database.query(
      "SELECT id, is_active FROM newsletter_subscriptions WHERE email = ?",
      [email],
    )) as any[];

    if (existingSubscriber.length > 0) {
      const subscriber = existingSubscriber[0];

      if (subscriber.is_active) {
        return NextResponse.json({
          success: true,
          data: {
            message: "Email is already subscribed to our newsletter",
            status: "already_subscribed",
          },
        });
      } else {
        // Reactivate subscription
        await Database.query(
          `UPDATE newsletter_subscriptions 
           SET is_active = TRUE, updated_at = NOW() 
           WHERE email = ?`,
          [email],
        );

        return NextResponse.json({
          success: true,
          data: {
            message: "Welcome back! Your subscription has been reactivated",
            status: "reactivated",
          },
        });
      }
    }

    // Create new subscription
    const result = (await Database.query(
      `INSERT INTO newsletter_subscriptions (
        email, 
        name, 
        preferences, 
        subscription_date,
        is_active
      ) VALUES (?, ?, ?, NOW(), TRUE)`,
      [
        email,
        name || null,
        JSON.stringify(
          preferences || {
            causes: true,
            updates: true,
            weekly_digest: true,
          },
        ),
      ],
    )) as any;

    // Send welcome email
    try {
      await EmailService.sendWelcomeEmail({
        email,
        name: name || "Subscriber",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        message: "Successfully subscribed to newsletter!",
        status: "subscribed",
      },
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe to newsletter" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    // For security, we should use a token-based unsubscribe
    // For now, we'll allow direct email unsubscribe
    const result = (await Database.query(
      "UPDATE newsletter_subscriptions SET is_active = FALSE, updated_at = NOW() WHERE email = ? AND is_active = TRUE",
      [email],
    )) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Email not found or already unsubscribed" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Successfully unsubscribed from newsletter",
        status: "unsubscribed",
      },
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe from newsletter" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const subscriber = (await Database.query(
      "SELECT email, name, preferences, subscription_date, is_active FROM newsletter_subscriptions WHERE email = ?",
      [email],
    )) as any[];

    if (subscriber.length === 0) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 },
      );
    }

    const sub = subscriber[0];
    return NextResponse.json({
      success: true,
      data: {
        email: sub.email,
        name: sub.name,
        preferences: JSON.parse(sub.preferences || "{}"),
        subscription_date: sub.subscription_date,
        is_active: sub.is_active,
      },
    });
  } catch (error) {
    console.error("Get newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get subscription details" },
      { status: 500 },
    );
  }
}
