import { fetchAndSnippetWikiPages } from "@/lib/wiki_api_helper";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  LanguageCode,
} from "@/types/language";
function parseLanguage(value: string | undefined): LanguageCode {
  if (value && LANGUAGE_CODES.includes(value as LanguageCode)) {
    return value as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const get = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  const idsParam = get("ids");
  const ids = idsParam
    ? idsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;
  const seed = get("seed");
  const numPages = ids?.length ?? Number(get("numPages") ?? 3);
  const snippetLength = Number(get("snippetLength") ?? 40);
  const language = parseLanguage(get("lang") ?? get("language"));

  const { wikiPages, parsedSeed } = await fetchAndSnippetWikiPages(
    numPages,
    snippetLength,
    language,
    seed,
    ids,
  );

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 20px 80px",
        color: "var(--text)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontSize: 36,
          marginBottom: 24,
        }}
      >
        Play bootstrap
      </h1>

      <pre
        style={{
          background: "var(--surface)",
          padding: 16,
          borderRadius: 8,
          fontSize: 13,
          overflow: "auto",
          marginBottom: 24,
        }}
      >
        {JSON.stringify(
          { ids, seed, numPages, snippetLength, language, parsedSeed },
          null,
          2,
        )}
      </pre>

      {wikiPages.map((page) => (
        <article
          key={page.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>{page.title}</h2>
          <p style={{ fontSize: 13, color: "var(--textdim)", marginBottom: 12 }}>
            id: {page.id} ·{" "}
            <a href={page.url} target="_blank" rel="noreferrer">
              {page.url}
            </a>
          </p>
          <p style={{ lineHeight: 1.6, marginBottom: 12 }}>
            <strong>Snippet:</strong> {page.content_censored}
          </p>
          <details>
            <summary style={{ cursor: "pointer", color: "var(--textdim)" }}>
              Raw content ({page.content_raw?.length ?? 0} chars)
            </summary>
            <pre
              style={{
                marginTop: 12,
                fontSize: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 240,
                overflow: "auto",
              }}
            >
              {page.content_raw}
            </pre>
          </details>
        </article>
      ))}
    </div>
  );
}
