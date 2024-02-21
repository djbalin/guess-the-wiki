import { useRef, useState } from "react";
// import { WordSlider } from "./WordSlider";
import { SnippetAmountInput } from "./SnippetAmountInput";
import { LoadingStatus, WikiDocument } from "@/resources/TypesEnums";
import { fetchAndSnippetRandomWikiPages } from "@/scripts/api_helper";
import DifficultyButton from "./DifficultyButton";
import DifficultyButtons from "./DifficultyButtons";

interface InputProps {
  // onPlayGame: (num_pages: number, snippet_length: number) => Promise<void>;
  onPlayGame: (wikiPages: WikiDocument[]) => void;
}

// export type DifficultyParameters = {
//   easy: { difficulty: string; snippetAmount: number; snippetLength: number };
//   medium: { difficulty: string; snippetAmount: number; snippetLength: number };
//   hard: { difficulty: string; snippetAmount: number; snippetLength: number };
//   extreme: { difficulty: string; snippetAmount: number; snippetLength: number };
// };

type DifficultyTitle = "Easy" | "Medium" | "Hard" | "Extreme";

export type DifficultyParameter = {
  title: DifficultyTitle;
  snippetAmount: number;
  snippetLength: number;
};

const DIFFICULTY_PARAMETERS: DifficultyParameter[] = [
  { title: "Easy", snippetAmount: 2, snippetLength: 50 },
  { title: "Medium", snippetAmount: 3, snippetLength: 40 },
  { title: "Hard", snippetAmount: 4, snippetLength: 30 },
  { title: "Extreme", snippetAmount: 5, snippetLength: 20 },
];

export default function GameControls(props: InputProps) {
  // const [snippetLengthValue, setSnippetLengthValue] = useState("30");
  // const [snippetAmount, setSnippetAmount] = useState("3");
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [gameParameters, setGameParameters] = useState(
    // easy: DIFFICULTY_PARAMETERS.easy,
    DIFFICULTY_PARAMETERS[1]
    // hard: DIFFICULTY_PARAMETERS.hard,
    // extreme: DIFFICULTY_PARAMETERS.extreme,
  );
  // const handlePlayGame = () => {
  //   props.onPlayGame(parseInt(snippetAmount), parseInt(snippetLengthValue));
  // };

  async function handlePlayGame() {
    setLoading(true);
    const wikiDocuments: WikiDocument[] = await fetchAndSnippetRandomWikiPages(
      gameParameters.snippetAmount,
      // parseInt(snippetAmount),
      // parseInt(snippetLengthValue)
      gameParameters.snippetLength
    );
    setLoading(false);
    props.onPlayGame(wikiDocuments);
    // props.onPlayGame(parseInt(snippetAmount), parseInt(snippetLengthValue));
  }

  return (
    <form
      action={async () => {}}
      className="flex border-2 bg-amber-500 rounded-lg p-2 px-4 justify-evenly flex-row gap-x-8"
    >
      {loading ? (
        <div className="min-w-[100%] top-0 left-0 min-h-screen flex items-center justify-center z-10 absolute bg-purple-300 bg-opacity-40">
          <span className="text-4xl">LOADING..</span>
        </div>
      ) : (
        <></>
      )}
      <div id="sliders" className="flex gap-y-2 flex-col">
        <h2 className="text-2xl w-full text-center">Tweak difficulty:</h2>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row gap-x-2 justify-end">
            <label className="w-full" htmlFor="snippetsAmountSlider">
              Number of snippets:{" "}
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
                // setSnippetAmount(val.target.value)}
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
                  // setSnippetAmount("10");
                } else {
                  setGameParameters({
                    ...gameParameters,
                    snippetAmount: intVal,
                  });
                  // setSnippetAmount(e.target.value);
                }
              }}
            />
          </div>
          <div className="flex flex-row gap-x-2 justify-end">
            <label className="w-full" htmlFor="snippetLengthSlider">
              Words in snippets:
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
                // setSnippetLengthValue(val.target.value);
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
                  // setSnippetAmount("10");
                } else {
                  setGameParameters({
                    ...gameParameters,
                    snippetLength: intVal,
                  });
                  // setSnippetAmount(e.target.value);
                }
                // if (parseInt(e.target.value) > 100) {
                //   setSnippetLengthValue("100");
                // } else {
                //   setSnippetLengthValue(e.target.value);
                // }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h2 className="text-2xl w-full text-center">Difficulty:</h2>
        <div id="buttons" className="flex flex-shrink gap-x-4 flex-wrap ">
          <DifficultyButtons
            difficulties={DIFFICULTY_PARAMETERS}
            setGameParameters={setGameParameters}
          ></DifficultyButtons>
          {/* <DifficultyButton></DifficultyButton> */}
          {/* <button
            className="gamecontrol_button difficulty_button  bg-green-600  "
            onClick={(e) => {
              setSnippetAmount("2");
              setSnippetLengthValue("50");
              setDifficulty("easy");
            }}
          >
            Easy
          </button>
          <button
            className="gamecontrol_button difficulty_button bg-yellow-400"
            onClick={(e) => {
              setSnippetAmount("3");
              setSnippetLengthValue("40");
              setDifficulty("medium");
            }}
          >
            Medium
          </button>
          <button
            className="gamecontrol_button difficulty_button bg-orange-500"
            onClick={(e) => {
              setSnippetAmount("4");
              setSnippetLengthValue("20");
              setDifficulty("hard");
            }}
          >
            Hard
          </button>
          <button
            className="gamecontrol_button difficulty_button bg-red-700 "
            onClick={(e) => {
              setSnippetAmount("5");
              setSnippetLengthValue("10");
              setDifficulty("extreme");
            }}
          >
            Extreme
          </button> */}
          <div className="flex items-center justify-around ">
            <button
              className="text-xs md:text-sm lg:text-lg font-semibold border-4 border-rose-400 border-opacity-20  w-[16rem] px-4 py-3 bg-purple-600 transition hover:duration-[250ms] hover:ease-in-out hover:bg-fuchsia-700"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handlePlayGame();
              }}
            >
              PLAY GAME
            </button>
            {/* {renderButton()} */}
          </div>
        </div>
      </div>
    </form>
  );
}
