import { getCurrentUser } from "@/db/auth";
import { db } from "@/db/init";
import { resultsTable } from "@/db/schema";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

const createResultSchema = z.object({
  isVictory: z.boolean(),
  difficulty: z.enum(DIFFICULTY_LEVELS),
});

export const resultsRoutes = new Hono()
  .get("/", async (c) => {
    const results = await db.select().from(resultsTable).limit(10);
    return c.json(results);
  })
  .post("/", zValidator("json", createResultSchema), async (c) => {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { isVictory, difficulty } = c.req.valid("json");
    const result = await db
      .insert(resultsTable)
      .values({
        clerkUserId: clerkUser.id,
        isVictory,
        difficulty,
      })
      .returning();
    return c.json(result, 201);
  });
