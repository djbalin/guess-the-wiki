import { getCurrentUser } from "@/db/auth";
import { db } from "@/db/init";
import { resultsTable } from "@/db/schema";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

const createResultSchema = z.object({
  isVictory: z.boolean(),
  difficulty: z.enum(DIFFICULTY_LEVELS),
});

const RESULTS_PAGE_SIZE = 50;

export const resultsRoutes = new Hono()
  // Returns the signed-in user's own results. This must stay scoped to the
  // caller: the rows carry Clerk user IDs, so an unscoped query would hand
  // every caller other players' identifiers.
  .get("/", async (c) => {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const results = await db
      .select()
      .from(resultsTable)
      .where(eq(resultsTable.clerkUserId, clerkUser.id))
      .orderBy(desc(resultsTable.createdAt))
      .limit(RESULTS_PAGE_SIZE);
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
