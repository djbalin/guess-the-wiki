# Guess the Wiki

Match shuffled Wikipedia article titles to snippets of their own text. Words
from the title are censored out of the snippet, so you have to guess from
context.

Built with Next.js 16 (App Router), Hono for the API layer, Clerk for auth,
and Drizzle + Neon Postgres for stored results.

## Getting started

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev
```

The app runs at http://localhost:3000.

### Environment variables

See [`.env.example`](.env.example) for the full list. In short:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | for results/profile | Neon Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | Clerk client key |
| `CLERK_SECRET_KEY` | yes | Clerk server key |
| `NEXT_PUBLIC_APP_URL` | no | Absolute base URL; falls back to `VERCEL_URL`, then localhost |

Clerk keys are needed for *every* request, because the proxy (middleware) in
[`proxy.ts`](proxy.ts) runs on all non-static routes. Without them the app
returns a 500 on every page.

`DATABASE_URL` is only read when a query actually runs, so `npm run build` and
the Wikipedia game itself work without a database — only `/profile` and the
results API need one.

### Database

The schema lives in [`db/schema.ts`](db/schema.ts) and migrations are committed
under `drizzle/`.

```bash
npm run db:generate   # create a migration after changing the schema
npm run db:migrate    # apply pending migrations
npm run db:push       # push the schema directly (development only)
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (`node --test` via tsx) |

CI runs lint, typecheck, tests, and a build on every pull request — see
[`.github/workflows/ci.yml`](.github/workflows/ci.yml). The build step
deliberately runs without secrets, so a missing environment variable can never
be the thing that breaks a deploy.

## Deploying

The app is a server-rendered Next.js application with API routes, auth
middleware, and a database. It cannot be exported to a static host such as
GitHub Pages.

1. Import the repository into Vercel (or any Node host that supports Next.js 16).
2. Set the environment variables above for the Preview and Production
   environments.
3. Apply migrations against the production database (`npm run db:migrate`).
4. Deploy. `VERCEL_URL` is picked up automatically; set `NEXT_PUBLIC_APP_URL`
   if you serve from a custom domain.

## Project layout

```
app/            Routes, layout, game store, theme tokens
  api/          Catch-all handler that mounts the Hono app
components/     Game UI, category explorer, header
contexts/       Language, theme, and game-status providers
db/             Drizzle schema, client, and Clerk helper
drizzle/        Committed SQL migrations
lib/            Hono routes, Wikipedia client, text processing
  __tests__/    Unit tests
types/          Shared types
```

## How a round is built

1. `GET /api/play` asks Wikipedia for random article metadata (or specific page
   IDs, when `ids` is supplied).
2. Each article's plain-text extract is fetched.
3. Words from the title are censored out of the extract — whole-word,
   case-insensitive, skipping the most common words in that language.
4. A seeded random snippet of `snippetLength` words is cut from the result, so
   the same `seed` always produces the same round.
