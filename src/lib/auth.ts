import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { DatabaseService } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isVerified: profile.email_verified,
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const user = await DatabaseService.findUserByEmail(credentials.email)
          
          if (!user || !user.password) {
            throw new Error('Invalid email or password')
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValidPassword) {
            throw new Error('Invalid email or password')
          }

          if (!user.isVerified) {
            throw new Error('Please verify your email address before signing in')
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error(error instanceof Error ? error.message : 'Authentication failed')
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // For OAuth providers, check if user exists and update info
        if (account?.provider !== 'credentials' && user.email) {
          const existingUser = await DatabaseService.findUserByEmail(user.email)
          
          if (existingUser) {
            // Update user info from OAuth provider
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name || existingUser.name,
                avatar: user.image || existingUser.avatar,
                isVerified: true, // OAuth users are considered verified
                lastLogin: new Date(),
              }
            })
          } else {
            // Create new user for OAuth sign-in
            await DatabaseService.createUser({
              name: user.name || 'User',
              email: user.email,
              avatar: user.image,
              isVerified: true,
            })
          }
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.isAdmin = user.isAdmin
        token.isVerified = user.isVerified
        token.userId = user.id
      }

      // Refresh user data on each request
      if (token.email) {
        try {
          const dbUser = await DatabaseService.findUserByEmail(token.email)
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin
            token.isVerified = dbUser.isVerified
            token.userId = dbUser.id.toString()
            token.name = dbUser.name
            token.picture = dbUser.avatar
          }
        } catch (error) {
          console.error('JWT callback error:', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.isVerified = token.isVerified as boolean
        session.user.name = token.name
        session.user.image = token.picture
      }

      return session
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign-in
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log sign-in event
      console.log(`User ${user.email} signed in with ${account?.provider}`)
      
      // Create analytics event
      if (user.id) {
        await DatabaseService.createAnalyticsEvent({
          userId: parseInt(user.id),
          sessionId: `signin-${Date.now()}`,
          eventType: 'user_signin',
          eventData: {
            provider: account?.provider,
            isNewUser,
          },
        })
      }

      // Send welcome notification for new users
      if (isNewUser && user.id) {
        await DatabaseService.createNotification({
          userId: parseInt(user.id),
          title: 'Welcome to Hands2gether!',
          message: 'Thank you for joining our community. Start exploring causes and making a difference today.',
          type: 'system',
          actionUrl: '/causes',
        })
      }
    },

    async signOut({ session, token }) {
      // Log sign-out event
      console.log(`User ${session?.user?.email || token?.email} signed out`)
      
      if (token?.userId) {
        await DatabaseService.createAnalyticsEvent({
          userId: parseInt(token.userId as string),
          sessionId: `signout-${Date.now()}`,
          eventType: 'user_signout',
          eventData: {},
        })
      }
    },

    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
      
      // Send welcome email (implement with your email service)
      // await sendWelcomeEmail(user.email, user.name)
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

// Helper functions for authentication
export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static async createUser(data: {
    name: string
    email: string
    password: string
  }) {
    const existingUser = await DatabaseService.findUserByEmail(data.email)
    
    if (existingUser) {
      throw new Error('A user with this email already exists')
    }

    const hashedPassword = await this.hashPassword(data.password)
    
    const user = await DatabaseService.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      isVerified: false, // Email verification required
    })

    // Generate email verification token
    const verificationToken = this.generateVerificationToken()
    
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: verificationToken }
    })

    // Send verification email (implement with your email service)
    // await sendVerificationEmail(user.email, user.name, verificationToken)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    }
  }

  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token }
    })

    if (!user) {
      throw new Error('Invalid or expired verification token')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifyToken: null,
      }
    })

    return user
  }

  static async initiatePasswordReset(email: string) {
    const user = await DatabaseService.findUserByEmail(email)
    
    if (!user) {
      // Don't reveal if user exists for security
      return { success: true }
    }

    const resetToken = this.generateResetToken()
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      }
    })

    // Send password reset email (implement with your email service)
    // await sendPasswordResetEmail(user.email, user.name, resetToken)

    return { success: true }
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      throw new Error('Invalid or expired reset token')
    }

    const hashedPassword = await this.hashPassword(newPassword)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    })

    return user
  }

  static generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  static generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  static async getUserPermissions(userId: number) {
    const user = await DatabaseService.findUserById(userId)
    
    if (!user) {
      return { isAdmin: false, canCreate: false, canEdit: false, canDelete: false }
    }

    return {
      isAdmin: user.isAdmin,
      canCreate: user.isVerified,
      canEdit: user.isVerified,
      canDelete: user.isAdmin,
      canModerate: user.isAdmin,
    }
  }
}

// Type extensions for NextAuth
declare module 'next-auth' {
  interface User {
    isAdmin?: boolean
    isVerified?: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      isAdmin: boolean
      isVerified: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    isAdmin?: boolean
    isVerified?: boolean
  }
}