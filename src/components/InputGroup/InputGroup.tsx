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
          <button className="w-[10rem]" onClick={handlePlayGame}>
            PLAY GAME :)
          </button>
        );
      case "LOADING":
        return (
          <button className="w-[10rem] cursor-wait opacity-50">
            LOADING...
          </button>
        );
      case "ERROR":
        return (
          <button className="w-[10rem]" onClick={handlePlayGame}>
            ERROR loading data :( Try again!
          </button>
        );
    }
  }

  return (
    <div className="w-full gap-x-24 min-h-[10rem] gap-y-6 justify-around grid grid-cols-6">
      <div className="grid col-span-2">
        <WordSlider
          snippetLengthValue={snippetLengthValue}
          setSnippetLengthValue={setSnippetLengthValue}
        />
        <SnippetAmountInput
          snippetAmount={snippetAmount}
          setSnippetAmount={setSnippetAmount}
        />
      </div>

      <div className="grid col-span-1 items-center justify-around ">
        {renderButton()}
      </div>
    </div>
  );
}
