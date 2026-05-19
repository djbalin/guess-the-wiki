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

const initialState: FetchState = {
  status: "loading",
  data: undefined,
};

export function useGameData() {
  const [dataState, setDataState] = useState<FetchState>(initialState);
  const router = useRouter();
  const pathname = usePathname();

  const { gameParams, setIsActive } = useGameStore();

  const { ids, lang, numPages, seed, snippetLength } = gameParams;

  // useEffect(() => {
  async function loadGame() {
    console.warn("LOADING GAME wit hparams:");
    console.log(gameParams);
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
      console.error(`validated params not ok, params:`);
      setDataState({
        data: null,
        status: "error",
      });
      return;
    }

    setIsActive(true);

    console.log("calling load, ids passed: ", ids);

    const res = await client.api.play.$get({
      query: {
        lang: validationResult.params.lang,
        numPages: String(validationResult.params.numPages),
        snippetLength: String(validationResult.params.snippetLength),
        ids: ids ?? undefined,
        seed: String(seed) ?? undefined,
      },
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error("validation failed:", errorBody);
      setDataState({ data: null, status: "error" });
      return;
    }
    const json = (await res.json()) as GetPlayResult;

    // Wait if function is ready to return in less than 500ms
    const elapsed = Date.now() - startTime;
    if (elapsed < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 2000 - elapsed));
    }

    setDataState({
      data: json,
      status: "ready",
    });

    const query = gameParamsToSearchParams(gameParams).toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    console.log("GAME LOADED, status: ");
    console.log(json);
  }

  return { dataState, loadGame };
}
