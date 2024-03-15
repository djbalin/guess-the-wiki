"use client";
import { useState } from "react";
import {
  // DifficultyTitles,
  // DifficultyTitlesENUM,
  Languages,
  WikiDocument,
} from "@/resources/TypesEnums";
import { fetchAndSnippetRandomWikiPages } from "@/scripts/api_helper";
import DifficultyButtons from "./DifficultyButtons";
import { GB, DK, FR } from "country-flag-icons/react/3x2";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { DIFFICULTY_DESCRIPTORS, GAME_SETTINGS } from "@/assets/strings";
import { setCookie } from "cookies-next";
import LanguageButtons from "./LanguageButtons";
// import US from "country-flag-icons/react/3x2/US";
// import US from "country-flag-icons/react/3x2/US";
// import { Languages } from "@/resources/TypesEnums";

interface InputProps {
  onPlayGame: (wikiPages: WikiDocument[]) => void;
}

export type DifficultyParameter = {
  // difficultyDescriptor: { [key in DifficultyTitlesENUM]: string };
  difficultyIndex: number;
  difficultyDescriptor: string;
  snippetAmount: number;
  snippetLength: number;
};
export default function GameControls(props: InputProps) {
  const languageContext = useLanguageContext();
  const language = languageContext.language;
  const DIFFICULTY_PARAMETERS: DifficultyParameter[] = [
    {
      difficultyIndex: 0,
      difficultyDescriptor: DIFFICULTY_DESCRIPTORS[language][0],
      snippetAmount: 2,
      snippetLength: 50,
    },
    {
      difficultyIndex: 1,
      difficultyDescriptor: DIFFICULTY_DESCRIPTORS[language][1],
      snippetAmount: 3,
      snippetLength: 40,
    },
    {
      difficultyIndex: 2,
      difficultyDescriptor: DIFFICULTY_DESCRIPTORS[language][2],
      snippetAmount: 4,
      snippetLength: 25,
    },
    {
      difficultyIndex: 3,
      difficultyDescriptor: DIFFICULTY_DESCRIPTORS[language][3],
      snippetAmount: 5,
      snippetLength: 10,
    },
  ];
  const [loading, setLoading] = useState(false);
  const [gameParameters, setGameParameters] = useState(
    DIFFICULTY_PARAMETERS[1]
  );

  async function handlePlayGame() {
    setLoading(true);
    const wikiDocuments: WikiDocument[] = await fetchAndSnippetRandomWikiPages(
      gameParameters.snippetAmount,
      gameParameters.snippetLength,
      languageContext.language
    );
    setLoading(false);
    props.onPlayGame(wikiDocuments);
  }

  return (
    <form
      action={async () => {}}
      className="flex border-2 bg-amber-500 rounded-lg p-2 px-4 justify-between flex-row lg:gap-x-32"
    >
      {loading && (
        <div className="min-w-[100%] top-0 left-0 min-h-screen flex items-center justify-center z-10 absolute bg-purple-300 bg-opacity-40">
          <span className="text-4xl">LOADING..</span>
        </div>
      )}
      <div id="sliders" className="flex  gap-y-2 flex-col">
        <h2 className="text-2xl font-semibold w-full text-center">
          {GAME_SETTINGS[language].tweak}
        </h2>
        <div className="flex flex-col gap-y-2 ">
          <div className="flex flex-row gap-x-2 justify-end">
            <label className="w-full" htmlFor="snippetsAmountSlider">
              {GAME_SETTINGS[language].snippetCount}
            </label>
            <input
              min="2"
              max="5"
              step="1"
              type="range"
              id="snippetLengthChoice"
              className="w-32"
              onChange={(val) => {
                try {
                  setGameParameters({
                    ...gameParameters,
                    snippetAmount: parseInt(val.target.value),
                  });
                } catch (error) {
                  alert("WRONG INPUT!");
                }
              }}
              value={gameParameters.snippetAmount}
            />
            <input
              className="w-8  text-center bg-zinc-700 text-white"
              type="text"
              name=""
              id="snippetsAmountSlider"
              value={gameParameters.snippetAmount}
              onFocus={(e) => {
                e.target.select();
              }}
              onChange={(e) => {
                const intVal = parseInt(e.target.value);
                if (intVal > 10) {
                  setGameParameters({
                    ...gameParameters,
                    snippetAmount: 10,
                  });
                } else {
                  setGameParameters({
                    ...gameParameters,
                    snippetAmount: intVal,
                  });
                }
              }}
            />
          </div>
          <div className="flex flex-row gap-x-2 justify-end">
            <label className="w-full" htmlFor="snippetLengthSlider">
              {GAME_SETTINGS[language].snippetLength}
            </label>
            <input
              min="0"
              max="50"
              step="5"
              type="range"
              id="snippetLengthChoice"
              className="w-32"
              onChange={(val) => {
                setGameParameters({
                  ...gameParameters,
                  snippetLength: parseInt(val.target.value),
                });
              }}
              value={gameParameters.snippetLength}
            />
            <input
              className="text-center w-8  bg-zinc-700 text-white"
              type="text"
              name=""
              id="snippetLengthSsider"
              value={gameParameters.snippetLength}
              onFocus={(e) => {
                e.target.select();
              }}
              onChange={(e) => {
                const intVal = parseInt(e.target.value);
                if (intVal > 100) {
                  setGameParameters({
                    ...gameParameters,
                    snippetAmount: 100,
                  });
                } else {
                  setGameParameters({
                    ...gameParameters,
                    snippetLength: intVal,
                  });
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col  gap-y-2">
        <div className="flex flex-row gap-x-2">
          <h2 className="text-2xl font-semibold w-full text-center">
            {GAME_SETTINGS[language].difficulty}
          </h2>
          <LanguageButtons />
        </div>
        <div
          id="buttons"
          className="flex flex-row flex-wrap w-full justify-center gap-x-4 gap-y-4 items-center "
        >
          {/* <div className="grid xl:col-span-1 col-span-2"> */}
          <DifficultyButtons
            difficulties={DIFFICULTY_PARAMETERS}
            setGameParameters={setGameParameters}
          ></DifficultyButtons>
          <div className="flex items-center justify-around xl:w-auto w-full">
            <button
              className="text-xs md:text-sm lg:text-lg font-semibold border-4 border-rose-400 border-opacity-20  w-[16rem] px-4 py-3 bg-purple-600 transition hover:duration-[250ms] hover:ease-in-out hover:bg-fuchsia-700"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handlePlayGame();
              }}
            >
              {GAME_SETTINGS[language].play}
            </button>
          </div>
          {/* </div> */}
        </div>
      </div>
    </form>
  );
}
