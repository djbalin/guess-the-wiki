export const IS_DEV = process.env.NODE_ENV === "development";

/**
 * Returns an absolute base URL for use in server-side fetch calls (RSC, Route Handlers, etc.).
 * Never use this on the client — relative paths work there and are always preferred.
 *
 * Priority:
 *   1. NEXT_PUBLIC_APP_URL  — set this in Vercel to your production URL (e.g. https://my-app.vercel.app)
 *   2. VERCEL_URL           — injected automatically by Vercel for every deployment
 *   3. localhost:3000       — local development fallback
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
