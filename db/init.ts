import { drizzle } from "drizzle-orm/neon-http";

type Db = ReturnType<typeof drizzle>;

let cached: Db | null = null;

/**
 * Builds the Drizzle client on first use.
 *
 * This is deliberately lazy: creating the client at module scope means every
 * module that imports `db` — including pages Next.js only *analyses* at build
 * time — needs DATABASE_URL to be present, which makes `next build` fail on any
 * machine that has no database configured.
 */
function getDb(): Db {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and point it at your Neon database.",
    );
  }

  cached = drizzle(url);
  return cached;
}

/**
 * Drizzle client. Behaves like the real client, but the underlying connection
 * is only constructed the first time a query is actually issued.
 */
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
