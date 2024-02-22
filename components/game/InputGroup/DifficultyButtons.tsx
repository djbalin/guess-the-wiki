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
  return (
    <div className="flex flex-row flex-wrap gap-x-4">
      {difficulties.map((difficulty) => {
        return (
          <DifficultyButton
            parameters={difficulty}
            setGameParameters={setGameParameters}
            activeDifficulty={activeDifficulty}
            setActiveDifficulty={setActiveDifficulty}
          ></DifficultyButton>
        );
      })}
    </div>
  );
}
