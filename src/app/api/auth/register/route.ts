import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserService } from "@/lib/database";
import { EmailService } from "@/lib/email";
import bcrypt from "bcryptjs";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name too long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await UserService.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "A user with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await UserService.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      isVerified: false,
    });

    // Send welcome email (don't block the response if email fails)
    EmailService.sendWelcomeEmail({
      name: validatedData.name,
      email: validatedData.email,
    }).catch((error) => {
      console.error("Welcome email failed (non-blocking):", error);
    });

    // TODO: Add analytics logging when analytics service is implemented

    return NextResponse.json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

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

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "auth/register",
    timestamp: new Date().toISOString(),
  });
}
