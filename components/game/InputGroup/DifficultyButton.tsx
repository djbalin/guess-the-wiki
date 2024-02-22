// import { DifficultyTitles } from "@/resources/TypesEnums";
import { DifficultyParameter } from "./GameControls";
import { Difficulties } from "@/resources/TypesEnums";

// const buttonStyles;

// const buttonStyles: { [key in Difficulties]: string } = {
const buttonStyles = [
  "bg-green-600",
  "bg-yellow-400",
  "bg-orange-500",
  "bg-red-700",
];

export default function DifficultyButton({
  parameters,
  setGameParameters,
  activeDifficulty,
  setActiveDifficulty,
}: {
  parameters: DifficultyParameter;
  setGameParameters: React.Dispatch<React.SetStateAction<DifficultyParameter>>;
  activeDifficulty: number;
  setActiveDifficulty: React.Dispatch<React.SetStateAction<number>>;
}) {
  // const difficultyIndex = parameters.difficultyIndex;
  // const style = buttonStyles.difficultyIndex;
  return (
    <button
      className={`gamecontrol_button ${
        buttonStyles[parameters.difficultyIndex]
      } ${
        activeDifficulty == parameters.difficultyIndex && "gamecontrol_active"
      }`}
      onClick={(e) => {
        setGameParameters(parameters);
        setActiveDifficulty(parameters.difficultyIndex);
      }}
    >
      {parameters.difficultyDescriptor}
    </button>
  );
}
