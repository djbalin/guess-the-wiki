type SnippetAmountInputProps = {
  snippetAmount: string;
  setSnippetAmount: React.Dispatch<React.SetStateAction<string>>;
};

export function SnippetAmountInput({
  snippetAmount,
  setSnippetAmount,
}: SnippetAmountInputProps) {
  return (
    <div className="">
      <span className="">
        <label htmlFor="snippetsAmountSlider">Number of snippets: </label>
        <input
          className="w-8 text-center bg-zinc-700 text-white"
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
      </span>
      <input
        min="2"
        max="5"
        step="1"
        type="range"
        id="snippetLengthChoice"
        className="w-full"
        onChange={(val) => setSnippetAmount(val.target.value)}
        value={snippetAmount}
      ></input>
    </div>
  );
}
