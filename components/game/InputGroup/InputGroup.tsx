import { useState } from "react";
// import { WordSlider } from "./WordSlider";
import { SnippetAmountInput } from "./SnippetAmountInput";
import { LoadingStatus, WikiDocument } from "@/resources/TypesEnums";
import { fetchAndSnippetRandomWikiPages } from "@/scripts/api_helper";

interface InputProps {
  // onPlayGame: (num_pages: number, snippet_length: number) => Promise<void>;
  onPlayGame: (wikiPages: WikiDocument[]) => void;
  loadingStatus: LoadingStatus;
}

export default function InputGroup(props: InputProps) {
  const [snippetLengthValue, setSnippetLengthValue] = useState("30");
  const [snippetAmount, setSnippetAmount] = useState("3");
  const [loading, setLoading] = useState(false);
  // const handlePlayGame = () => {
  //   props.onPlayGame(parseInt(snippetAmount), parseInt(snippetLengthValue));
  // };

  async function handlePlayGame() {
    setLoading(true);
    const wikiDocuments: WikiDocument[] = await fetchAndSnippetRandomWikiPages(
      parseInt(snippetAmount),
      parseInt(snippetLengthValue)
    );
    setLoading(false);
    props.onPlayGame(wikiDocuments);
    // props.onPlayGame(parseInt(snippetAmount), parseInt(snippetLengthValue));
  }

  // function renderButton() {
  //   switch (props.loadingStatus) {
  //     case "IDLE":
  //       return (
  //         <button
  //           className="text-xs md:text-sm lg:text-lg font-semibold border-4 border-rose-400 border-opacity-20  w-[16rem] px-4 py-3 bg-purple-600 transition hover:duration-[250ms] hover:ease-in-out hover:bg-fuchsia-700"
  //           onClick={handlePlayGame}
  //         >
  //           PLAY GAME :)
  //         </button>
  //       );
  //     case "LOADING":
  //       return (
  //         <button className="loading_button text-xs md:text-sm lg:text-lg font-semibold border-4 border-rose-400 border-opacity-20  w-[16rem] px-4 py-3 bg-purple-600">
  //           LOADING...
  //         </button>
  //       );
  //     case "ERROR":
  //       return (
  //         <button
  //           className="text-xs md:text-sm lg:text-lg font-semibold border-4 border-rose-400 border-opacity-20  w-[16rem] px-4 py-3 bg-purple-600 transition hover:duration-[250ms] hover:ease-in-out hover:bg-fuchsia-700"
  //           // className="font-medium text-md w-[10rem] px-2 py-3 bg-purple-600"
  //           onClick={handlePlayGame}
  //         >
  //           ERROR loading data :( Try again!
  //         </button>
  //       );
  //   }
  // }

  return (
    <form
      action={async () => {}}
      className="flex border-2 bg-amber-500 rounded-lg p-2 px-4 justify-evenly flex-row gap-x-8"
    >
      {loading ? (
        <div className="min-w-screen min-h-screen absolute bg-red-300">
          LOADING..
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
              onChange={(val) => setSnippetAmount(val.target.value)}
              value={snippetAmount}
            />
            <input
              className="w-8  text-center bg-zinc-700 text-white"
              type="text"
              name=""
              id="snippetsAmountSlider"
              value={snippetAmount}
              onFocus={(e) => {
                e.target.select();
              }}
              onChange={(e) => {
                if (parseInt(e.target.value) > 10) {
                  setSnippetAmount("10");
                } else {
                  setSnippetAmount(e.target.value);
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
              onChange={(val) => setSnippetLengthValue(val.target.value)}
              value={snippetLengthValue}
            />
            <input
              className="text-center w-8  bg-zinc-700 text-white"
              type="text"
              name=""
              id="snippetLengthSsider"
              value={snippetLengthValue}
              onFocus={(e) => {
                e.target.select();
              }}
              onChange={(e) => {
                if (parseInt(e.target.value) > 100) {
                  setSnippetLengthValue("100");
                } else {
                  setSnippetLengthValue(e.target.value);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h2 className="text-2xl w-full text-center">Difficulty:</h2>
        <div id="buttons" className="flex flex-shrink gap-x-4 flex-wrap ">
          <button
            className="gamecontrol_button difficulty_button  bg-green-600  "
            onClick={() => {
              setSnippetAmount("2");
              setSnippetLengthValue("50");
            }}
          >
            Easy
          </button>
          <button
            className="gamecontrol_button difficulty_button bg-yellow-400"
            onClick={() => {
              setSnippetAmount("3");
              setSnippetLengthValue("40");
            }}
          >
            Medium
          </button>
          <button
            className="gamecontrol_button difficulty_button bg-orange-500"
            onClick={() => {
              setSnippetAmount("4");
              setSnippetLengthValue("20");
            }}
          >
            Hard
          </button>
          <button
            className="gamecontrol_button difficulty_button bg-red-700 shadow-red-950 shadow-xl"
            onClick={() => {
              setSnippetAmount("5");
              setSnippetLengthValue("10");
            }}
          >
            Extreme
          </button>
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
