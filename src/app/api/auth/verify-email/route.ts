import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthService } from '@/lib/auth'
import { DatabaseService } from '@/lib/prisma'

const verifySchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = verifySchema.parse(body)

    // Verify email with token
    const user = await AuthService.verifyEmail(token)

    // Create welcome notification
    await DatabaseService.createNotification({
      userId: user.id,
      title: 'Email Verified Successfully!',
      message: 'Your email has been verified. You can now access all features of Hands2gether.',
      type: 'system',
      actionUrl: '/dashboard',
    })

    // Log verification event
    await DatabaseService.createAnalyticsEvent({
      userId: user.id,
      sessionId: `verify-${Date.now()}`,
      eventType: 'email_verification',
      eventData: {
        timestamp: new Date().toISOString(),
      },
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || undefined,
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now sign in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })

  } catch (error) {
    console.error('Email verification error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Email verification failed' },
      { status: 500 }
    )
  }
}

// Resend verification email
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = z.object({ email: z.string().email() }).parse(body)

    const user = await DatabaseService.findUserByEmail(email)
    
    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a verification email has been sent.',
      })
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'This email is already verified.' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const verificationToken = AuthService.generateVerificationToken()
    
    await DatabaseService.transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerifyToken: verificationToken }
      })
    })

    // TODO: Send verification email with new token
    // await sendVerificationEmail(user.email, user.name, verificationToken)

    return NextResponse.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    })

  } catch (error) {
    console.error('Resend verification error:', error)

    return NextResponse.json(
      { success: false, message: 'Failed to resend verification email' },
      { status: 500 }
    )
  }
}