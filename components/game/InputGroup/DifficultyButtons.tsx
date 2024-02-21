import { useState } from "react";
import DifficultyButton from "./DifficultyButton";
import { DifficultyParameter, DifficultyTitle } from "./GameControls";

export default function DifficultyButtons({
  difficulties,
  setGameParameters,
}: {
  difficulties: DifficultyParameter[];
  setGameParameters: React.Dispatch<React.SetStateAction<DifficultyParameter>>;
}) {
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyTitle>(
    difficulties[1].title
  );
  return difficulties.map((difficulty) => {
    return (
      <span>
        <DifficultyButton
          parameters={difficulty}
          setGameParameters={setGameParameters}
          activeDifficulty={activeDifficulty}
          setActiveDifficulty={setActiveDifficulty}
        ></DifficultyButton>
      </span>
    );
  });
}
