import { handlers } from "@/lib/auth";

console.log("NextAuth route handler loaded");

// Export the handlers for Next.js App Router
export const { GET, POST } = handlers;

// Add runtime configuration
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
