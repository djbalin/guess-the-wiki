import { getCurrentUser } from "@/db/auth";
import { db } from "@/db/init";
import { resultsTable } from "@/db/schema";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { fetchAndSnippetWikiPages } from "@/lib/wiki_api_helper";
import { LANGUAGE_CODES, LanguageCode } from "@/types/language";
import axios from "axios";

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

const wikipediaClient = axios.create({
  baseURL: "https://en.wikipedia.org/w/api.php",
  headers: {
    "User-Agent": "MyApp/1.0 (myemail@example.com)",
  },
});

app.get("/play", async (c) => {
  console.log("Get request to play. query params:");
  const { numpages, snippetlength, lang, seed, ids } = c.req.query();
  const idsParsed = ids.split(",");

  const n = parseFloat;
  validateInputs(numpages, snippetlength, lang, seed, idsParsed);

  const result = await fetchAndSnippetWikiPages(
    Number(numpages),
    Number(snippetlength),
    lang as LanguageCode,
    seed,
    idsParsed,
  );

  return c.json(result);

  // return c.json(query);
});

function validateInputs(
  numPages: string,
  snippetLength: string,
  lang: string,
  seed: string,
  ids: string[],
) {
  if (!LANGUAGE_CODES.includes(lang as LanguageCode)) {
    throw new Error(`Invalid language code: ${lang}`);
  }
  if (!parseFloat(seed)) {
    throw new Error(`Invalid seed: ${seed}`);
  }
  if (!parseInt(numPages)) {
    throw new Error(`Invalid numPages: ${numPages}`);
  }
  if (!parseInt(snippetLength)) {
    throw new Error(`Invalid snippetLength: ${snippetLength}`);
  }
  for (const id of ids) {
    if (!parseInt(id)) {
      throw new Error(`Invalid id: ${id}`);
    }
  }
}

export const GET = handle(app);
export const POST = handle(app);
