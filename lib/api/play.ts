import { fetchAndSnippetWikiPages } from "@/lib/wiki_api_helper";
import { LanguageCode } from "@/types/language";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { WikiDocument } from "@/types/wiki";

export type GetPlayResult = {
  parsedSeed: string | number;
  wikiPages: WikiDocument[];
};

const playRouteValidator = z.object({
  numPages: z.coerce.number(),
  snippetLength: z.coerce.number(),
  seed: z.coerce.number().optional(),
  lang: z.coerce.string(),
  ids: z.coerce.string().optional(),
});

export const playRoutes = new Hono().get(
  "/",
  zValidator("query", playRouteValidator),
  async (c) => {
    console.log("heyeye");
    const { lang, snippetLength, seed, ids, numPages } = c.req.valid("query");

    console.log("Hello from play route");

    const idsParsed = ids
      ? ids
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

    const result: GetPlayResult = await fetchAndSnippetWikiPages(
      numPages,
      snippetLength,
      lang as LanguageCode,
      seed ?? null,
      idsParsed,
    );

    return c.json(result);
  },
);
