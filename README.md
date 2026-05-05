# CircleUs

A personal CRM for tracking and nurturing the relationships that matter most. Log interactions, spot who you've fallen out of touch with, and build a history of every meaningful connection.

## Features

- **Contact management** — store name, employer, job title, and school for each person
- **Interaction timeline** — log every conversation, meeting, or message with a title, notes, date, rating (1–10), and emoji
- **Reconnect reminders** — contacts you haven't interacted with in 90+ days are automatically flagged
- **Relationship stats** — see total interactions and days since last contact at a glance
- **Private by default** — every contact and interaction is scoped to your account via Row Level Security; no one else can see your data

## Tech stack

- **Next.js 16** (App Router) — server components, server actions, file-based routing
- **Supabase** — Postgres database, auth (magic link / OAuth), Row Level Security
- **Tailwind CSS v4** + **shadcn/ui** — styling and UI primitives
- **Vitest** — unit tests for service and logic layers

## Local development

**1. Clone and install**

```bash
git clone <repo-url>
cd CircleUs
npm install
```

**2. Set up Supabase**

Create a project at [supabase.com](https://supabase.com), then run the schema in the SQL editor:

```
supabase/schema.sql
```

**3. Add environment variables**

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in your Supabase project under **Settings → API**.

**4. Configure auth redirect**

In Supabase → **Authentication → URL Configuration**, set:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

**5. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Deployment

### Vercel (recommended)

1. Push to GitHub and import the repo at [vercel.com](https://vercel.com)
2. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in **Project Settings → Environment Variables**
3. Deploy

### Supabase auth redirect (required after deploy)

In Supabase → **Authentication → URL Configuration**, add your production domain:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/auth/callback`
