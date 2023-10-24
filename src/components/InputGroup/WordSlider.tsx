type WordSliderProps = {
  snippetLengthValue: string;
  setSnippetLengthValue: React.Dispatch<React.SetStateAction<string>>;
};

export function WordSlider(props: WordSliderProps) {
  return (
    <div className="">
      <label className="" htmlFor="snippetLengthSlider">
        Words in snippets:{" "}
      </label>
      <input
        className="text-center w-8 bg-zinc-700 text-white"
        type="text"
        name=""
        id="snippetLengthSsider"
        value={props.snippetLengthValue}
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => {
          if (parseInt(e.target.value) > 100) {
            props.setSnippetLengthValue("100");
          } else {
            props.setSnippetLengthValue(e.target.value);
          }
        }}
      />
      <input
        min="0"
        max="50"
        step="5"
        type="range"
        id="snippetLengthChoice"
        className="w-full"
        onChange={(val) => props.setSnippetLengthValue(val.target.value)}
        value={props.snippetLengthValue}
      ></input>
    </div>
  );
}
