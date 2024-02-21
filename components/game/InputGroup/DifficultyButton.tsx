import { DifficultyParameter } from "./GameControls";

const buttonStyles = {
  Easy: "bg-green-600",
  Medium: "bg-yellow-400",
  Hard: "bg-orange-500",
  Extreme: "bg-red-700",
};

export default function DifficultyButton({
  parameters,
  setGameParameters,
}: {
  parameters: DifficultyParameter;
  setGameParameters: React.Dispatch<React.SetStateAction<DifficultyParameter>>;
}) {
  return (
    <button
      className={`gamecontrol_button difficulty_button ${
        buttonStyles[parameters.title]
      }`}
      onClick={(e) => {
        console.log("setting game parameters to");
        console.log(parameters);

        setGameParameters(parameters);
        // handleClickDifficulty(e);
        // setSnippetAmount("2");
        // setSnippetLengthValue("50");
        // setDifficulty("easy");
      }}
    >
      {parameters.title}
    </button>
  );
}
