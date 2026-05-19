import type { AppType } from "./app";
import { hc } from "hono/client";
import { getBaseUrl } from "../is_dev";

export function createApiClient(baseUrl = "") {
  return hc<AppType>(baseUrl);
}

// singleton for browser / RSC on same origin
export const client = createApiClient(
  typeof window !== "undefined" ? "" : getBaseUrl(),
);
