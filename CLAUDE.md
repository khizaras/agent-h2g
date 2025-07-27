# Claude AI Instructions for Hands2gether

## Project Context & Architecture

Hands2gether is a Next.js 15 community assistance platform with direct MySQL integration (no ORM). Recently migrated from Prisma to raw SQL for better performance and control.

### Core Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Ant Design 5.x
- **Backend**: Next.js API routes + NextAuth v5 beta + mysql2
- **State**: Redux Toolkit with SSR-safe persistence
- **Styling**: Ant Design + Framer Motion + custom CSS
- **Database**: Direct MySQL with connection pooling

## Critical Implementation Patterns

### Database Operations

```typescript
// ALWAYS use static methods - no instances
import { Database } from '@/lib/database'

// Basic query
const users = await Database.query('SELECT * FROM users WHERE active = ?', [true])

// Transaction example
const result = await Database.transaction(async (connection) => {
  await connection.execute('INSERT INTO causes (...) VALUES (...)', [...])
  await connection.execute('UPDATE users SET cause_count = cause_count + 1 WHERE id = ?', [userId])
  return { success: true }
})
```

### Authentication (NextAuth v5)

```typescript
// API routes - use auth() function
import { auth } from "@/lib/auth";
const session = await auth();
if (!session?.user)
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Client components - use useSession hook
import { useSession } from "next-auth/react";
const { data: session, status } = useSession();
```

### API Route Structure

```typescript
// src/app/api/[endpoint]/route.ts
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const results = await Database.query('SELECT ...', [...])
    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Message' }, { status: 500 })
  }
}
```

### Component Patterns

```typescript
// Client components with Ant Design + TypeScript
"use client"
import { Card, Button } from 'antd'
import { motion } from 'framer-motion'

interface Props {
  data: CauseType[]
}

export default function CausesList({ data }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {data.map(cause => (
        <Card key={cause.id}>...</Card>
      ))}
    </motion.div>
  )
}
```

## File Structure Understanding

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints (route.ts files)
│   ├── auth/              # Auth pages
│   ├── causes/            # Causes pages
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Header, Footer, etc.
│   ├── forms/            # Form components
│   └── ui/               # Base UI components
├── lib/                   # Core utilities
│   ├── auth.ts           # NextAuth config
│   └── database.ts       # MySQL wrapper
├── store/                 # Redux Toolkit
│   └── slices/           # Feature slices
└── types/                # TypeScript definitions
```

## Common Tasks & Solutions

### Adding New API Endpoint

1. Create `src/app/api/[name]/route.ts`
2. Export named functions: `export async function GET/POST(...)`
3. Use `auth()` for authentication, `Database.query()` for data
4. Return consistent JSON: `{ success: boolean, data?, error? }`

### Database Schema Changes

1. Update `database_schema.sql`
2. Run migration scripts if needed
3. Update TypeScript types in `src/types/`
4. Test with `npm run db:seed`

### Adding New Page

1. Create `src/app/[route]/page.tsx`
2. Use `"use client"` for interactive components
3. Import session with `useSession()` for auth state
4. Use Ant Design components + Framer Motion for animations

### Redux State Management

```typescript
// Create slice in src/store/slices/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCauses = createAsyncThunk("causes/fetch", async () => {
  const response = await fetch("/api/causes");
  return response.json();
});

const causesSlice = createSlice({
  name: "causes",
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder.addCase(fetchCauses.fulfilled, (state, action) => {
      state.items = action.payload.data;
    });
  },
});
```

## Development Workflow

### Essential Commands

```bash
npm run dev          # Start development server
npm test             # Run Jest tests
npm run type-check   # TypeScript validation
npm run db:seed      # Seed database
npm run build        # Production build
```

### Debugging Database Issues

- Check connection in `src/lib/database.ts`
- Verify environment variables in `.env`
- Use `Database.healthCheck()` for connection testing
- Check MySQL logs for query errors

### Authentication Debugging

- NextAuth v5 debug mode: Set `debug: true` in config
- Check `/api/auth/session` endpoint
- Verify credentials provider setup
- Session issues: Clear cookies and restart

## Migration-Specific Notes

**Recently migrated from Prisma (July 2025)**:

- Old Prisma client calls → `Database.query()` static methods
- Schema: `prisma/schema.prisma` → `database_schema.sql`
- Models: Removed Prisma models, using direct SQL
- Types: Manual TypeScript interfaces instead of generated types

**Common Migration Pitfalls**:

- Don't use `new Database()` - use static methods only
- Raw SQL requires manual parameter binding: `Database.query(sql, [param1, param2])`
- No automatic relation loading - join tables manually
- Transaction handling changed - use `Database.transaction()`

## Integration Points

- **ImageKit**: Image uploads configured in environment variables
- **OpenRouter.ai**: AI features require `OPENROUTER_API_KEY`
- **Ant Design**: Theme customization in `src/config/theme.ts`
- **Framer Motion**: Page transitions and component animations

## Error Handling Patterns

```typescript
// API Routes
try {
  const result = await Database.query(sql, params);
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error("Database error:", error);
  return NextResponse.json(
    { success: false, error: "Failed to fetch data" },
    { status: 500 },
  );
}

// Components
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

try {
  setLoading(true);
  const response = await fetch("/api/endpoint");
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

---

**Note**: This codebase prioritizes type safety, direct database control, and modern React patterns. When in doubt, check existing implementations in `src/app/api/causes/route.ts` and `src/app/causes/page.tsx` for reference patterns.
