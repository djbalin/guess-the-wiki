import { DifficultyParameter } from "./GameControls";
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
