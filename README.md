# Survey

Personal survey app for a behavioural study with Control / Treatment groups.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · shadcn/ui · Drizzle ORM · Neon Postgres · ExcelJS
- **Flow:** participant lands on `/`, gets randomly assigned to Control or Treatment, answers 10 Phase-1 questions (group-specific), then 10 Phase-2 questions (shared), then a final "Bet or not?" + 1-5 knowledge rating.
- **Admin:** `/admin` is gated by a single password. Admins manage questions and export results as `.xlsx` matching the original template (104 columns, merged "Phase X - Question Y" headers, sub-headers per question).

## 1. Prerequisites

- Node.js 20+ (tested with 25.x)
- A Neon Postgres database — get a connection string from <https://console.neon.tech>

## 2. Set up env vars

Copy the example file:

```sh
cp .env.local.example .env.local
```

Fill in:

```
DATABASE_URL=postgresql://...neon.tech/db?sslmode=require
ADMIN_PASSWORD=<your admin password>
ADMIN_SESSION_SECRET=<a long random string, 32+ chars>
```

## 3. Install + push schema

```sh
npm install
npm run db:push       # creates the questions / sessions / answers tables on Neon
```

## 4. Run

```sh
npm run dev
```

Open <http://localhost:3000>.

- `/admin` — sign in with `ADMIN_PASSWORD`, then add questions.
- `/survey` — participants start here.

The participant link to share is just `/` or `/survey`.

## 5. Adding questions

You need exactly **10 questions in each of these three buckets** before any participant can start the survey:

| Bucket                | Phase | Group     |
| --------------------- | ----- | --------- |
| Phase 1 – Control     | 1     | Control   |
| Phase 1 – Treatment   | 1     | Treatment |
| Phase 2 – Shared      | 2     | Shared    |

Each question has:
- Question text
- Three options labelled A / B / C
- The right answer (A / B / C) — never shown to participants
- The recommendation (A / B / C) — always shown to participants in a box
- An explanation — hidden by default; the participant clicks "Open explanation" to reveal it. Whether they opened it (`true` / `false`) is recorded.

The participant's answer time is measured client-side from when the question first appears to when they click Next.

## 6. Exporting results

Go to `/admin/sessions` and click **Export Excel**. The file will only contain
**completed** sessions (one row per participant). The layout matches the
original template:

- Row 1: `Phase X - Question Y` merged across 5 columns per question, plus
  `Bet or not?` and the long Vietnamese knowledge-rating prompt at the end.
- Row 2: `Participant's answer | Recommendation | Right answer | Open box? | Time to answer (s)` for each question; `Participant's choice?` for the last two columns.
- Row 3+: one row per participant with `Participant ID`, `Group`, then their data across 100 question columns and the 2 final columns.

## 7. Deploying

The app is a standard Next.js app — Vercel works well with Neon. Set the same
three env vars in your Vercel project. Run the schema push once against
production:

```sh
DATABASE_URL=<prod url> npm run db:push
```

## Project layout

```
app/
  page.tsx                       # landing
  survey/                        # participant flow
  admin/                         # gated admin UI
  api/
    admin/...                    # admin APIs (auth, questions CRUD, export)
    survey/...                   # participant APIs (start, questions, answer, finish)
components/ui/                   # shadcn/ui primitives (button, card, input, ...)
lib/
  db/                            # Drizzle schema + Neon client (lazy)
  auth.ts                        # password check + signed cookie
  excel-export.ts                # builds the .xlsx in template format
  validators.ts                  # Zod schemas for API input
  constants.ts                   # group enums, knowledge-rating prompt
middleware.ts                    # protects /admin/*
drizzle.config.ts                # drizzle-kit config
```

## Useful scripts

```sh
npm run dev          # dev server on :3000
npm run build        # production build
npm run start        # run production build
npm run db:push      # push schema to DATABASE_URL
npm run db:studio    # open Drizzle Studio
```
