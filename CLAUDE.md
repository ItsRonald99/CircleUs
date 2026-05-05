# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # start dev server
npm run build      # production build + TypeScript check
npm run test       # run all tests once
npm run test:watch # run tests in watch mode
```

Run a single test file:
```bash
npx vitest run src/__tests__/contactService.test.ts
```

> `npm run lint` is currently broken due to a broken ESLint install. Use `npm run build` to verify types.

## Architecture

CircleUs is a relationship-tracking app (personal CRM) built with Next.js 16 App Router and Supabase.

### Routes

- `/` — login page (unauthenticated landing)
- `/dashboard` — overview: stats + "needs reconnecting" contacts
- `/contacts` — full contacts list with create/edit/delete
- `/contacts/[id]` — contact profile with interaction timeline

### Data layer

- **`src/lib/db/types.ts`** — hand-maintained Supabase schema types (`Contact`, `Interaction`, and their `Insert`/`Update` variants). Update this whenever the schema changes.
- **`src/lib/db/supabase-server.ts`** — `createServerSupabaseClient()` for Server Components and Server Actions (cookie-based, verified).
- **`src/lib/db/supabase.ts`** — `createClient()` for Client Components (browser).

### Service layer (`src/lib/services/`)

Pure functions that accept a `SupabaseClient` and perform database queries. No auth logic here — just CRUD. Tests mock the Supabase client at this layer.

### Server Actions (`src/actions/`)

`"use server"` functions consumed by Client Components. Each action:
1. Creates a server Supabase client
2. Calls `db.auth.getUser()` and redirects to `/` if unauthenticated
3. For interaction actions, additionally calls `assertContactOwnership(db, contactId, user.id)` to verify the user owns the parent contact before any write
4. Calls the service layer
5. Calls `revalidatePath` to bust the cache — contact mutations revalidate `/dashboard`, `/contacts`, and `/contacts/[id]` as appropriate

### Page pattern

Every page is a Server Component that fetches data directly, then passes it to a `*Client.tsx` sibling that owns interactivity. Dynamic routes call `notFound()` when the service returns null. Example: `contacts/[id]/page.tsx` → `ContactProfileClient.tsx`.

### Auth flow

Supabase magic-link / OAuth. The callback lands at `/auth/callback/route.ts`, which exchanges the code for a session and redirects to `/dashboard`. The middleware (`src/proxy.ts`) enforces auth on all routes: unauthenticated users go to `/`, authenticated users on `/` go to `/dashboard`.

### Business logic

`src/lib/logic/reminderLogic.ts` — pure functions for "needs reconnect" logic (threshold: 90 days since last interaction). Keep pure so they stay unit-testable without any DB.

### UI components

`src/components/ui/` — shadcn/ui primitives. `src/components/` subdirectories group by domain (auth, contacts, interactions, layout).

## Database

Schema lives in `supabase/schema.sql`. All tables use Row Level Security — contacts are scoped to `user_id`, interactions are scoped via their parent contact's `user_id`. Apply the schema manually in the Supabase SQL editor.

## Environment

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
