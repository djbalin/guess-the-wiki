"use client";

import { client } from "@/lib/api/client";
import { GetPlayResult } from "@/lib/api/play";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const validateRequiredParams = (args: {
  numPages: string | null;
  snippetLength: string | null;
  lang: string | null;
}):
  | {
      error: true;
    }
  | {
      error: false;
      params: {
        lang: string;
        numPages: string;
        snippetLength: string;
      };
    } => {
  const { lang, numPages, snippetLength } = args;
  if (!lang || !numPages || !snippetLength) {
    return {
      error: true,
    };
  } else {
    return {
      error: false,
      params: {
        numPages,
        snippetLength,
        lang,
      },
    };
  }
};

type FetchState =
  | {
      status: "loading";
      data: undefined;
    }
  | {
      status: "error";
      data: null;
    }
  | {
      status: "ready";
      data: GetPlayResult;
    };

const initialState: FetchState = {
  status: "loading",
  data: undefined,
};

export default function PlayContent() {
  const searchParams = useSearchParams();

  const ids = searchParams.get("ids");
  const seed = searchParams.get("seed");
  const numPages = searchParams.get("numpages");
  const snippetLength = searchParams.get("snippetlength");
  const lang = searchParams.get("lang");

  console.log(`lang:${lang},snippetle:${snippetLength}`);

  const [dataState, setDataState] = useState<FetchState>(initialState);

  // const validatedParams = validateAndParseParams(
  //   numPages,
  //   snippetLength,
  //   lang,
  //   seed,
  //   null,
  // );

  useEffect(() => {
    async function load() {
      // if (validatedParams.error === true) {
      //   return;
      // }

      setDataState({
        data: undefined,
        status: "loading",
      });
      const validationResult = validateRequiredParams({
        lang,
        numPages,
        snippetLength,
      });
      if (validationResult.error === true) {
        console.error(`validated params not ok, params:`);
        setDataState({
          data: null,
          status: "error",
        });
        return;
      }

      console.log("calling load");
      // const { data } = validatedParams;
      // const { ids, lang, numPages, seed, snippetLength } = data;
      const res = await client.api.play.$get({
        query: {
          lang: validationResult.params.lang,
          numPages: validationResult.params.numPages,
          snippetLength: validationResult.params.snippetLength,
          ids: ids ?? undefined,
          seed: ids ?? undefined,
        },
      });

      if (!res.ok) {
        console.error("res not ok");
        setDataState({
          data: null,
          status: "error",
        });
        return;
      }
      const json = (await res.json()) as GetPlayResult;
      setDataState({
        data: json,
        status: "ready",
      });
    }
    load();
  }, [ids, lang, numPages, snippetLength]);

  const { data, status } = dataState;

  if (status === "error") {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 20px 80px",
          color: "var(--text)",
        }}
      >
        {"ERRRor"}
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 20px 80px",
          color: "var(--text)",
        }}
      >
        Loading…
      </div>
    );
  }

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
          {
            ids,
            seed,
            numPages: numPages,
            snippetLength: snippetLength,
            lang,
            seedParsed: data.parsedSeed,
          },
          null,
          2,
        )}
      </pre>

      {data.wikiPages.map((page) => (
        <article
          key={page.pageid}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>{page.title}</h2>
          <p
            style={{ fontSize: 13, color: "var(--textdim)", marginBottom: 12 }}
          >
            id: {page.pageid} ·{" "}
            <a href={page.fullurl} target="_blank" rel="noreferrer">
              {page.fullurl}
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
