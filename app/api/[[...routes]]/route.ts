import { getCurrentUser } from "@/db/auth";
import { db } from "@/db/init";
import { resultsTable } from "@/db/schema";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({
    message: "Welcome to the API!!",
  });
});
app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.get("/results", async (c) => {
  const results = await db.select().from(resultsTable).limit(10);
  return c.json(results);
});

app.post("/results", async (c) => {
  console.log("Post request to results. Context:");
  console.log(c);
  const clerkUser = await getCurrentUser();
  if (!clerkUser) {
    throw new HTTPException(400, { message: "Bad request" });
  }
  const { isVictory } = await c.req.json();
  const result = await db.insert(resultsTable).values({
    clerkUserId: clerkUser.id,
    isVictory,
  });
  return c.json(result);
});

export const GET = handle(app);
export const POST = handle(app);
