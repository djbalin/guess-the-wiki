import type { AppType } from "./app";
import { hc } from "hono/client";

export function createApiClient(baseUrl = "") {
  console.log("baseurl:", baseUrl);
  return hc<AppType>(baseUrl);
}

// singleton for browser / RSC on same origin
export const client = createApiClient(
  typeof window !== "undefined"
    ? ""
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
);
