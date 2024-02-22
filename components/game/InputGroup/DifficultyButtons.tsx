import { useState } from "react";
import DifficultyButton from "./DifficultyButton";
import { DifficultyParameter } from "./GameControls";
// import { DifficultyTitles } from "@/resources/TypesEnums";

export default function DifficultyButtons({
  difficulties,
  setGameParameters,
}: {
  difficulties: DifficultyParameter[];
  setGameParameters: React.Dispatch<React.SetStateAction<DifficultyParameter>>;
}) {
  const [activeDifficulty, setActiveDifficulty] = useState<number>(1);
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
