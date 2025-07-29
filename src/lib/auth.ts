import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserService } from "./database";
import bcrypt from "bcryptjs";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required");
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        try {
          console.log("🔐 Auth attempt for:", credentials.email);

          // Log database configuration (without sensitive info)
          console.log("🔧 Database config check:");
          console.log("   DB_HOST:", process.env.DB_HOST || "localhost");
          console.log("   DB_NAME:", process.env.DB_NAME || "next_h2g");
          console.log("   DB_PORT:", process.env.DB_PORT || "3306");
          console.log("   DB_USER:", process.env.DB_USER || "root");
          console.log(
            "   DB_PASSWORD:",
            process.env.DB_PASSWORD ? "SET" : "NOT SET",
          );

          // First, check database connectivity
          console.log("🏥 Checking database health...");
          const { Database } = await import("@/lib/database");
          const healthCheck = await Database.healthCheck();
          console.log("🏥 Database health:", healthCheck);

          if (healthCheck.status !== "healthy") {
            console.error("💀 Database is unhealthy:", healthCheck.error);
            throw new Error(
              `Database connectivity issue: ${healthCheck.error}`,
            );
          }

          // Find user by email
          const user = await UserService.findByEmail(credentials.email);
          console.log("👤 User found:", user ? "YES" : "NO");

          if (!user) {
            console.log("❌ User not found in database");
            return null;
          }

          // Verify password
          if (user.password) {
            console.log("🔑 Verifying password...");
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            console.log("✅ Password valid:", isPasswordValid);

            if (!isPasswordValid) {
              console.log("❌ Invalid password");
              return null;
            }
          } else {
            console.log("⚠️ User has no password set");
            return null;
          }

          console.log("🎉 Authentication successful for:", user.email);
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            is_admin: Boolean(user.is_admin),
            is_verified: Boolean(user.is_verified),
          };
        } catch (error) {
          console.error("💥 Auth error details:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            email: credentials.email,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.is_admin = (user as any).is_admin;
        token.is_verified = (user as any).is_verified;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).is_admin = token.is_admin;
        (session.user as any).is_verified = token.is_verified;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(error: Error) {
      console.error("NextAuth Error:", error);
    },
    warn(code: string) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code: string, metadata?: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("NextAuth Debug:", code, metadata);
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
