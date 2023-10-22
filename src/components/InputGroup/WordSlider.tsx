type WordSliderProps = {
  snippetLengthValue: string;
  setSnippetLengthValue: React.Dispatch<React.SetStateAction<string>>;
};

export function WordSlider(props: WordSliderProps) {
  return (
    <div className="w-auto grid col-span-1">
      <span className="w-full">
        <label htmlFor="snippetLengthSlider">Words in snippets: </label>
        <input
          className="w-8 text-center"
          type="text"
          name=""
          id="snippetLengthSlider"
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
      </span>
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
