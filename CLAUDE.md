# Claude AI Instructions for Hands2gether

## Project Context & Architecture

Hands2gether is a Next.js 15 community assistance platform with direct MySQL integration (no ORM). Recently migrated from Prisma to raw SQL for better performance and control.

### Core Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Ant Design 5.x
- **Backend**: Next.js API routes + NextAuth v5 beta + mysql2
- **State**: Redux Toolkit with SSR-safe persistence
- **Styling**: Ant Design + Framer Motion + custom CSS
- **Database**: Direct MySQL with connection pooling

### Recent Improvements (July 2025)

- **Profile System**: Redesigned profile page for simplicity and professionalism, added real profile update functionality with database persistence
- **Data Architecture**: Complete removal of mock data in favor of Redux-based real data loading with proper API response handling
- **Next.js 15 Compatibility**: Fixed dynamic route parameter issues requiring await for params
- **Redux Integration**: Enhanced state management with safety checks and fallback values for array operations

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

// Dynamic routes with Next.js 15 - IMPORTANT: params must be awaited
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Always await params in Next.js 15
    const result = await Database.query('SELECT * FROM table WHERE id = ?', [id])
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Message' }, { status: 500 })
  }
}

// Profile update API example
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, email, bio, phone } = await request.json();
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Update only existing columns in database
    const updateQuery = `
      UPDATE users 
      SET name = ?, email = ?, bio = ?, phone = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    await Database.query(updateQuery, [name, email, bio || null, phone || null, session.user.id]);
    
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
```

### Component Patterns

```typescript
// Client components with Ant Design + TypeScript
"use client"
import { Card, Button, Avatar, Typography, Form, Input, message } from 'antd'
import { motion } from 'framer-motion'
import { useSession } from "next-auth/react"
import { useAppDispatch, useAppSelector } from "@/store"

interface Props {
  data: CauseType[]
}

export default function CausesList({ data }: Props) {
  // Always provide fallback for arrays to prevent .map errors
  const safeCauses = Array.isArray(data) ? data : [];
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {safeCauses.map(cause => (
        <Card key={cause.id}>...</Card>
      ))}
    </motion.div>
  )
}

// Profile page with real API integration
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const handleEditProfile = async (values: any) => {
    try {
      setUpdating(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      if (data.success) {
        message.success("Profile updated successfully!");
        setProfile(prev => prev ? { ...prev, ...values } : null);
        setEditModalVisible(false);
      } else {
        message.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Simple, professional design - no fancy animations */}
    </div>
  );
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
import { useAppDispatch, useAppSelector } from "@/store";

export const fetchCauses = createAsyncThunk("causes/fetch", async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  const response = await fetch(`/api/causes?${queryParams}`);
  return response.json();
});

export const fetchFeaturedCauses = createAsyncThunk("causes/fetchFeatured", async () => {
  const response = await fetch("/api/causes/featured");
  return response.json();
});

const causesSlice = createSlice({
  name: "causes",
  initialState: { 
    causes: [], 
    featuredCauses: [], 
    loading: false, 
    error: null,
    pagination: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCauses.fulfilled, (state, action) => {
        // CRITICAL: Handle API response structure correctly
        // API returns { success: true, data: { causes: [...], pagination: {...} } }
        state.causes = action.payload.data?.causes || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFeaturedCauses.fulfilled, (state, action) => {
        state.featuredCauses = action.payload.data || [];
        state.loading = false;
      })
      .addCase(fetchCauses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCauses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch causes";
        state.causes = []; // Ensure causes is always an array
      });
  },
});

// Selectors with fallbacks
export const selectCausesList = (state: RootState) => state.causes.causes || [];
export const selectFeaturedCauses = (state: RootState) => state.causes.featuredCauses || [];
export const selectCausesLoading = (state: RootState) => state.causes.loading;

// Component usage with safety checks
export default function CausesPage() {
  const dispatch = useAppDispatch();
  const causes = useAppSelector(selectCausesList) || []; // Always provide fallback
  const loading = useAppSelector(selectCausesLoading);
  
  useEffect(() => {
    dispatch(fetchCauses());
  }, [dispatch]);
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {Array.isArray(causes) && causes.map(cause => (
        <div key={cause.id}>{cause.title}</div>
      ))}
      {!loading && causes.length === 0 && <div>No causes found</div>}
    </div>
  );
}
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

**Recent Architecture Fixes**:

- **Next.js 15 Dynamic Routes**: All dynamic API routes now properly await params: `const { id } = await params`
- **Redux API Structure**: Fixed "causes.map is not a function" by properly handling nested API responses: `state.causes = action.payload.data?.causes || []`
- **Array Safety**: Added `Array.isArray()` checks and fallback values throughout components to prevent runtime errors
- **Database Schema Alignment**: Profile updates only modify existing database columns (name, email, bio, phone)

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

## Common Error Patterns & Solutions

### "causes.map is not a function" Error
**Root Cause**: API response structure mismatch between backend and Redux expectations  
**Solution**: 
```typescript
// Wrong - expecting array directly
state.causes = action.payload.data

// Correct - extract nested causes array
state.causes = action.payload.data?.causes || []
```

### Next.js 15 Dynamic Route Parameters Error
**Error**: "Route used params.id. params should be awaited before using its properties"  
**Solution**:
```typescript
// Wrong
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // ERROR

// Correct  
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // FIXED
```

### Database Column Errors
**Error**: "Unknown column 'location' in 'field list'"  
**Solution**: Always verify column existence in database schema before using in queries. Use only existing columns: `name`, `email`, `bio`, `phone` for user updates.

---

**Note**: This codebase prioritizes type safety, direct database control, and modern React patterns. Recent improvements focus on professional UI design, real data integration, and robust error handling. When in doubt, check existing implementations in `src/app/api/causes/route.ts`, `src/app/causes/page.tsx`, and `src/app/profile/page.tsx` for reference patterns.
