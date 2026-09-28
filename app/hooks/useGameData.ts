import { client } from "@/lib/api/client";
import { GetPlayResult } from "@/lib/api/play";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useGameStore } from "../gameStore";
import { LanguageCode } from "@/types/language";

function gameParamsToSearchParams(params: {
  lang: LanguageCode;
  numPages: number;
  snippetLength: number;
  seed: number;
  ids: string[] | undefined;
}): URLSearchParams {
  const search = new URLSearchParams();
  search.set("lang", params.lang);
  search.set("numPages", String(params.numPages));
  search.set("snippetLength", String(params.snippetLength));
  search.set("seed", String(params.seed));
  if (params.ids?.length) {
    search.set("ids", params.ids.join(","));
  }
  return search;
}

const validateRequiredParams = (args: {
  numPages: number | null;
  snippetLength: number | null;
  lang: LanguageCode | null;
}):
  | {
      error: true;
    }
  | {
      error: false;
      params: {
        lang: LanguageCode;
        numPages: number;
        snippetLength: number;
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

export type FetchState =
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

/** Minimum time the loading skeleton stays on screen, in milliseconds. */
const MIN_LOADING_MS = 500;

const initialState: FetchState = {
  status: "loading",
  data: undefined,
};

export function useGameData() {
  const [dataState, setDataState] = useState<FetchState>(initialState);
  const router = useRouter();
  const pathname = usePathname();

  const { gameParams, setIsGameActive: setIsActive } = useGameStore();

  const { ids, lang, numPages, seed, snippetLength } = gameParams;

  // useEffect(() => {
  async function loadGame() {
    setDataState({
      data: undefined,
      status: "loading",
    });
    const startTime = Date.now();

    const validationResult = validateRequiredParams({
      lang,
      numPages,
      snippetLength,
    });
    if (validationResult.error === true) {
      console.error("Cannot start a game: missing language, numPages or snippetLength.");
      setDataState({
        data: null,
        status: "error",
      });
      return;
    }

    setIsActive(true);

    const res = await client.api.play.$get({
      query: {
        lang: validationResult.params.lang,
        numPages: String(validationResult.params.numPages),
        snippetLength: String(validationResult.params.snippetLength),
        ids: ids?.length ? ids.join(",") : undefined,
        seed: String(seed),
      },
    });

    if (!res.ok) {
      console.error(`Failed to load game (HTTP ${res.status}).`);
      setDataState({ data: null, status: "error" });
      return;
    }
    const json = (await res.json()) as GetPlayResult;

    // Hold the loading state briefly so a fast response does not make the
    // skeleton flash in and straight back out again.
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_LOADING_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
    }

    setDataState({
      data: json,
      status: "ready",
    });

    const query = gameParamsToSearchParams(gameParams).toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return { dataState, loadGame };
}
