import { useState } from "react";
import { WordSlider } from "./WordSlider";
import { SnippetAmountInput } from "./SnippetAmountInput";
import { LoadingStatus } from "../../resources/WikiHelperTypes";

interface InputProps {
  onGenerateSnippets: (
    num_pages: number,
    snippet_length: number
  ) => Promise<void>;
  loadingStatus: LoadingStatus;
}

export default function InputGroup(props: InputProps) {
  const [snippetLengthValue, setSnippetLengthValue] = useState("30");
  const [snippetAmount, setSnippetAmount] = useState("3");
  const handlePlayGame = () => {
    props.onGenerateSnippets(
      parseInt(snippetAmount),
      parseInt(snippetLengthValue)
    );
  };

  function renderButton() {
    switch (props.loadingStatus) {
      case "IDLE":
        return (
          <button
            className="gamecontrol_button w-[10rem] px-4 py-3 bg-purple-600"
            onClick={handlePlayGame}
          >
            PLAY GAME :)
          </button>
        );
      case "LOADING":
        return (
          <button className="gamecontrol_button w-[10rem] px-4 py-3 bg-purple-600 cursor-wait opacity-50">
            LOADING...
          </button>
        );
      case "ERROR":
        return (
          <button
            className="gamecontrol_button w-[10rem] px-4 py-3 bg-purple-600"
            onClick={handlePlayGame}
          >
            ERROR loading data :( Try again!
          </button>
        );
    }
  }

  return (
    <>
      <div className="flex flex-row h-auto justify-around pb-8">
        <div className="w-52 p-2 items-center justify-around">
          <WordSlider
            snippetLengthValue={snippetLengthValue}
            setSnippetLengthValue={setSnippetLengthValue}
          />
          <SnippetAmountInput
            snippetAmount={snippetAmount}
            setSnippetAmount={setSnippetAmount}
          />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-8 xl:gap-x-4 justify-evenly place-items-center">
          <div>
            <button
              className="gamecontrol_button difficulty_button  bg-green-600  "
              onClick={() => {
                setSnippetAmount("2");
                setSnippetLengthValue("50");
              }}
            >
              Easy
            </button>
          </div>

          <div className="grid">
            <button
              className="gamecontrol_button difficulty_button bg-yellow-400"
              onClick={() => {
                setSnippetAmount("3");
                setSnippetLengthValue("40");
              }}
            >
              Medium
            </button>
          </div>
          <div className="grid">
            <button
              className="gamecontrol_button difficulty_button bg-orange-500"
              onClick={() => {
                setSnippetAmount("4");
                setSnippetLengthValue("20");
              }}
            >
              Hard
            </button>
          </div>
          <div className="grid">
            <button
              className="gamecontrol_button difficulty_button bg-red-700 shadow-red-950 shadow-xl"
              onClick={() => {
                setSnippetAmount("5");
                setSnippetLengthValue("10");
              }}
            >
              Extreme
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around ">{renderButton()}</div>{" "}
    </>
  );
}
