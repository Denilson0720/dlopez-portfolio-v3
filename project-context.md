# Project Context — dlopez_portfolio_v3 Blog Feature

> AI Agent Reference Guide — read this before implementing any blog story.
> This is the single source of truth for patterns, boundaries, and rules.

---

## What This Is

A blog feature added to an existing Next.js 14 App Router portfolio. Owner-only auth (Clerk), Supabase Postgres + Storage, Tiptap v3 editor. Public routes are ISR; the editor is client-side only.

**Project path:** `/Users/denilsonlopez/projects/dlopez_portfolio_v3`

---

## Stack & Versions (use these exactly)

| Package | Version |
|---|---|
| Next.js | 14 (App Router) |
| TypeScript | strict mode |
| Tailwind CSS | (existing) |
| `@clerk/nextjs` | `^7.0.1` |
| `@supabase/supabase-js` | `^2.98.0` |
| `@supabase/ssr` | latest |
| `@tiptap/react` | `^3.20.0` |
| `@tiptap/pm` + `@tiptap/starter-kit` | (same release) |

**Tiptap warning:** v3 has breaking changes from v2. Use v3 docs only. v2 tutorials are incompatible.

---

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     # client-safe
CLERK_SECRET_KEY                      # server-only
NEXT_PUBLIC_SUPABASE_URL              # client-safe
NEXT_PUBLIC_SUPABASE_ANON_KEY         # client-safe
SUPABASE_SERVICE_ROLE_KEY             # server-only, Route Handlers only — NEVER in client bundle
```

---

## Directory Structure (new files only)

```
dlopez_portfolio_v3/
├── middleware.ts                          ← Clerk route protection
├── app/
│   ├── layout.tsx                         ← MODIFIED: ClerkProvider wrapper
│   ├── blog/
│   │   ├── page.tsx                       ← REPLACE stub: public index (ISR)
│   │   ├── [slug]/page.tsx                ← public post page (ISR + draft guard)
│   │   └── admin/
│   │       ├── page.tsx                   ← post management list
│   │       ├── new/page.tsx               ← new post editor
│   │       └── [id]/edit/page.tsx         ← edit existing post
│   └── api/blog/
│       ├── posts/route.ts                 ← POST create, GET list (admin)
│       ├── posts/[id]/route.ts            ← PUT update, DELETE
│       ├── posts/[id]/publish/route.ts    ← PATCH toggle published/draft
│       ├── posts/[id]/pin/route.ts        ← PATCH toggle pin (max 2)
│       ├── upload/route.ts                ← POST thumbnail to Supabase Storage
│       └── rss.xml/route.ts               ← GET RSS 2.0 feed
├── components/blog/
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   ├── PinnedPosts.tsx
│   ├── CategoryFilter.tsx                 ← 'use client'
│   ├── RichTextRenderer.tsx               ← renders Tiptap JSON → HTML (no editor bundle)
│   ├── PostEditor.tsx                     ← 'use client', full Tiptap editor
│   ├── ThumbnailUpload.tsx                ← 'use client', drag-and-drop
│   └── PostMeta.tsx                       ← date, category badge
├── lib/
│   ├── supabase/
│   │   ├── server.ts                      ← createServerClient (SSR/Route Handlers)
│   │   └── client.ts                      ← createBrowserClient ('use client' only)
│   └── blog/
│       ├── types.ts                       ← Post, PostStatus, PostCategory, ApiResponse<T>
│       ├── queries.ts                     ← Supabase reads + toPost() transform
│       ├── mutations.ts                   ← Supabase writes
│       ├── slug.ts                        ← auto-generate + deduplicate slug
│       ├── tiptap.ts                      ← generateHTML helper
│       └── rss.ts                         ← RSS 2.0 XML builder
└── supabase/migrations/
    └── 0001_create_posts.sql
```

---

## Database Schema

```sql
posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  summary       text,
  body          jsonb NOT NULL,                              -- Tiptap JSONContent
  category      text NOT NULL CHECK (category IN ('tech', 'random')),
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  pinned        boolean NOT NULL DEFAULT false,
  thumbnail_url text,
  published_at  timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)
```

**Indexes:** `status`, `pinned`, `slug` (unique), `published_at DESC`, `category`

**Note:** Add `moddatetime` trigger so `updated_at` auto-updates on every row change.

---

## TypeScript Types (`lib/blog/types.ts`)

```typescript
import type { JSONContent } from '@tiptap/react'

export type PostStatus = 'draft' | 'published'
export type PostCategory = 'tech' | 'random'

export interface Post {
  id: string
  title: string
  slug: string
  summary: string | null
  body: JSONContent
  category: PostCategory
  status: PostStatus
  pinned: boolean
  thumbnailUrl: string | null
  publishedAt: string | null  // ISO 8601
  createdAt: string
  updatedAt: string
}

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }
```

---

## Mandatory Patterns

### 1. API Response Shape — no exceptions

```typescript
// Success
return NextResponse.json({ data: post, error: null })
// Error
return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
```

HTTP codes: `200` GET/PATCH success, `201` POST create, `400` bad request, `401` unauthenticated, `404` not found, `500` server error.

---

### 2. Auth — first line of every write Route Handler

```typescript
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }
  // ...
}
```

---

### 3. Draft Guard — every public post page Server Component

```typescript
const post = await getPostBySlug(slug)
if (!post) notFound()

if (post.status === 'draft') {
  const { userId } = await auth()
  if (!userId) notFound()  // 404 not 403 — do NOT reveal draft exists
}
```

---

### 4. Clerk Middleware (`middleware.ts`)

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/blog/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) auth().protect()
})
```

---

### 5. Supabase Clients

**Server context** (Server Components, Route Handlers):
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookies().getAll(), setAll: () => {} } }
  )
}
```

**Client context** (`'use client'` components only):
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

### 6. Data Transform — DB rows never escape `lib/blog/queries.ts`

```typescript
function toPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    category: row.category as PostCategory,
    status: row.status as PostStatus,
    pinned: row.pinned,
    thumbnailUrl: row.thumbnail_url,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
```

---

### 7. Error Handling

**Route Handlers:**
```typescript
try {
  const post = await createPost(data)
  return NextResponse.json({ data: post, error: null }, { status: 201 })
} catch (err) {
  console.error('[POST /api/blog/posts]', err)
  return NextResponse.json({ data: null, error: 'Failed to create post' }, { status: 500 })
}
```

**Client components:**
```typescript
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

async function handleSave() {
  setIsLoading(true)
  setError(null)
  try {
    const res = await fetch('/api/blog/posts', { ... })
    const json: ApiResponse<Post> = await res.json()
    if (json.error) throw new Error(json.error)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    setIsLoading(false)
  }
}
```

---

### 8. Date Handling

- Dates are stored and returned as ISO 8601 strings — pass through as-is in data layer
- Format for display **at the component level only:**
```typescript
new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(post.publishedAt))
```

---

### 9. ISR + Cache Revalidation

Public pages use ISR. Route Handlers must call `revalidatePath()` after state changes:
- Publish/unpublish → `revalidatePath('/blog')` + `revalidatePath('/blog/' + slug)`
- Pin/unpin → `revalidatePath('/blog')`
- Delete → `revalidatePath('/blog')`

---

### 10. Pin Enforcement

Max 2 pinned posts. Enforced **at application layer** in the pin Route Handler — check current pinned count before allowing a new pin. No DB constraint exists for this.

---

### 11. Slug Generation

`lib/blog/slug.ts` must check for slug conflicts in DB and append `-2`, `-3` suffix if collision found. Handle before insert.

---

## Anti-Patterns — Never Do These

- ❌ Import `lib/supabase/server.ts` in a `'use client'` component
- ❌ Import `lib/supabase/client.ts` in a Server Component
- ❌ Return raw Supabase row objects from queries — always go through `toPost()`
- ❌ Import Supabase directly in components — only via `lib/blog/queries.ts` or `lib/blog/mutations.ts`
- ❌ Return 403 for unauthenticated draft access — always return 404
- ❌ Put `SUPABASE_SERVICE_ROLE_KEY` in the client bundle or any `NEXT_PUBLIC_` variable
- ❌ Format dates in the data layer — component level only
- ❌ Use Tiptap v2 docs/patterns — v3 only
- ❌ Return Route Handler responses without `ApiResponse<T>` shape

---

## Rendering Boundaries

| Route | Rendering | Auth Required |
|---|---|---|
| `/blog` | ISR (Server Component) | No |
| `/blog/[slug]` | ISR (Server Component) + draft guard | No (but draft check) |
| `/blog/admin/*` | Client-side only (`'use client'`) | Yes — Clerk middleware |
| `/api/blog/*` | Route Handlers | Yes — `auth()` check |
| `/api/blog/rss.xml` | Route Handler (dynamic) | No |

---

## Naming Conventions

- **DB columns:** `snake_case` — `published_at`, `thumbnail_url`
- **TypeScript fields:** `camelCase` — `publishedAt`, `thumbnailUrl`
- **Components:** `PascalCase.tsx` — `PostCard.tsx`
- **Utilities:** `camelCase.ts` — `queries.ts`, `mutations.ts`
- **API routes:** plural nouns, no verbs — `/api/blog/posts`, `/api/blog/posts/[id]/publish`
- **Booleans:** `is/has` prefix — `isPinned`, `isPublished`, `hasError`

---

## Test Structure

```
__tests__/blog/
  components/   — PostCard.test.tsx, CategoryFilter.test.tsx
  api/          — posts.test.ts, pin.test.ts
  lib/          — queries.test.ts, rss.test.ts
```

Mirror `app/` and `lib/` structure. Files: `*.test.ts` / `*.test.tsx`.

---

## Implementation Order

1. `supabase/migrations/0001_create_posts.sql` — schema first
2. `middleware.ts` — Clerk protection
3. `lib/supabase/server.ts` + `lib/supabase/client.ts`
4. `lib/blog/types.ts`
5. `lib/blog/queries.ts` + `lib/blog/mutations.ts`
6. Route Handlers (`app/api/blog/`)
7. Public pages (`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`)
8. Admin pages + Tiptap editor
9. Thumbnail upload
10. SEO `generateMetadata()` + RSS feed
11. Nav integration (ClerkProvider + admin link)
