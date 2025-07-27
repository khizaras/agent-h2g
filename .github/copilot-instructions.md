# Hands2gether AI Coding Agent Instructions

## Project Overview

Hands2gether is a Next.js 15 community-driven food assistance platform. It connects people in need with contributors, featuring cause creation, user profiles, notifications, admin tools, and an AI-powered chatbot. The stack includes Next.js 15, React 19, Ant Design, Redux Toolkit, direct MySQL (no ORM), NextAuth v5, and OpenRouter.ai for AI.

## Architecture & Key Patterns

- **Next.js App Router**: Uses `src/app/` directory with route handlers in `src/app/api/`. Pages in `src/app/[route]/page.tsx`.
- **Database**: Direct MySQL2 connection via `src/lib/database.ts` (Database class with static methods). **No Prisma/ORM** - uses raw SQL queries with connection pooling.
- **Authentication**: NextAuth v5 beta with custom credentials provider. Config in `src/lib/auth.ts`, handlers exported via `src/app/api/auth/[...nextauth]/route.ts`.
- **State Management**: Redux Toolkit with SSR-safe persistence in `src/store/`. Slices pattern for features (auth, causes, categories).
- **API Routes**: Export named functions (GET, POST) from `route.ts` files. Use `auth()` for session, `Database.query()` for data access.
- **UI**: Ant Design 5.x + Framer Motion + React Icons (Heroicons/Feather). Components in `src/components/` with TypeScript.

## Database Layer

```typescript
// Always use static methods from Database class
import { Database } from "@/lib/database";

const results = await Database.query("SELECT * FROM causes WHERE id = ?", [id]);
const connection = await Database.getConnection(); // For transactions
```

Service classes (UserService, AccountService) extend Database for auth operations. **Critical**: Use static methods, not instances.

## Authentication Patterns

```typescript
// In API routes
import { auth } from "@/lib/auth";
const session = await auth();
if (!session?.user)
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// In components (client-side)
import { useSession } from "next-auth/react";
const { data: session, status } = useSession();
```

NextAuth v5 uses `auth()` function, not `getServerSession()`. Export handlers directly: `export const { GET, POST } = handlers`.

## Developer Workflows

- **Install & Setup**: `npm install` at root. Configure `.env` (MySQL credentials required).
- **Database**: MySQL with raw SQL. Schema in `database_schema.sql`. Seed with `npm run db:seed`.
- **Development**: `npm run dev` starts Next.js dev server (usually localhost:3000/3001).
- **Testing**: `npm test` (Jest), `npm run test:e2e` (Playwright). Test files alongside components.
- **Build**: `npm run build` then `npm start` for production.

## Project-Specific Conventions

- **Components**: Use TypeScript + Ant Design. Functional components with hooks. Animation via Framer Motion.
- **API Design**: RESTful with consistent response format: `{ success: boolean, data?: any, error?: string }`.
- **Styling**: Ant Design theme + custom CSS in `src/styles/`. Use `className` over `styled-components`.
- **Error Handling**: Try/catch in API routes, return structured JSON errors with appropriate status codes.
- **File Structure**: Feature-based organization. Related components/pages grouped by domain (causes, auth, etc.).

## Integration Points

- **ImageKit**: Cloud image storage. Config in environment variables (`IMAGEKIT_*`).
- **OpenRouter.ai**: AI assistant API. Requires `OPENROUTER_API_KEY` in `.env`.
- **MySQL**: Direct connection via mysql2. Connection pooling configured in `src/lib/database.ts`.
- **NextAuth**: Session management with JWT strategy. Custom adapter for MySQL integration.

## Key Files & Examples

- **Database Operations**: `src/lib/database.ts` - Static Database class with query methods
- **Auth Config**: `src/lib/auth.ts` - NextAuth v5 configuration with credentials provider
- **API Route**: `src/app/api/causes/route.ts` - GET/POST handlers with auth and database queries
- **Page Component**: `src/app/causes/page.tsx` - Client component with Ant Design + animations
- **State Management**: `src/store/slices/causesSlice.ts` - Redux Toolkit slice patterns

## Migration Notes

**Recently migrated from Prisma to direct MySQL** (completed July 2025). Use `Database.query()` static methods, not Prisma client. Authentication migrated from custom Express middleware to NextAuth v5 beta.

---

**Feedback:** If any section is unclear or missing, please specify so it can be improved for future AI agents.
