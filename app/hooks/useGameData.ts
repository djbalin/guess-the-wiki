import { client } from "@/lib/api/client";
import { GetPlayResult } from "@/lib/api/play";
import { useEffect, useState } from "react";
import { useGameStore } from "../gameStore";
import { LanguageCode } from "@/types/language";

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

export function useGameData() {
  const [dataState, setDataState] = useState<FetchState>(initialState);

  const { gameParams, setGameParams } = useGameStore();

  const { ids, lang, numPages, seed, snippetLength } = gameParams;

  useEffect(() => {
    async function loadGame() {
      console.warn("LOADING GAME wit hparams:");
      console.log(gameParams);
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

      console.log("calling load, ids passed: ", ids);
      // const { data } = validatedParams;
      // const { ids, lang, numPages, seed, snippetLength } = data;
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
      setDataState({
        data: json,
        status: "ready",
      });
    }
    loadGame();
  }, [ids, lang, numPages, seed, snippetLength]);

  return dataState;
}
