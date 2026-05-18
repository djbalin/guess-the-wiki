import { getCurrentUser } from "@/db/auth";
import { db } from "@/db/init";
import { resultsTable } from "@/db/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const resultsRoutes = new Hono()
  .get("/", async (c) => {
    const results = await db.select().from(resultsTable).limit(10);
    return c.json(results);
  })
  .post("/", async (c) => {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    const { isVictory } = await c.req.json();
    const result = await db.insert(resultsTable).values({
      clerkUserId: clerkUser.id,
      isVictory,
    });
    return c.json(result);
  });
