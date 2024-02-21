import { DifficultyParameter, DifficultyTitle } from "./GameControls";

const buttonStyles = {
  Easy: "bg-green-600",
  Medium: "bg-yellow-400",
  Hard: "bg-orange-500",
  Extreme: "bg-red-700",
};

export default function DifficultyButton({
  parameters,
  setGameParameters,
  activeDifficulty,
  setActiveDifficulty,
}: {
  parameters: DifficultyParameter;
  setGameParameters: React.Dispatch<React.SetStateAction<DifficultyParameter>>;
  activeDifficulty: string;
  setActiveDifficulty: React.Dispatch<React.SetStateAction<DifficultyTitle>>;
}) {
  return (
    <button
      className={`gamecontrol_button ${buttonStyles[parameters.title]} ${
        activeDifficulty == parameters.title && "gamecontrol_active"
      }`}
      onClick={(e) => {
        setGameParameters(parameters);
        setActiveDifficulty(parameters.title);
      }}
    >
      {parameters.title}
    </button>
  );
}
