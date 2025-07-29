import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserService } from "./database";
import bcrypt from "bcryptjs";

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
          // Find user by email
          const user = await UserService.findByEmail(credentials.email);

          if (!user) {
            return null;
          }

          // Verify password
          if (user.password) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (!isPasswordValid) {
              return null;
            }
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            is_admin: Boolean(user.is_admin),
            is_verified: Boolean(user.is_verified),
          };
        } catch (error) {
          console.error("Auth error:", error);
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
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
