import { Hono } from "hono";
import { playRoutes } from "./play";
import { resultsRoutes } from "./results";

export const app = new Hono()
  .basePath("/api")
  .route("/play", playRoutes)
  .route("/results", resultsRoutes);

export type AppType = typeof app;
