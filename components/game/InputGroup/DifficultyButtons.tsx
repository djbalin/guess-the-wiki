import DifficultyButton from "./DifficultyButton";
import { DifficultyParameter } from "./GameControls";

export default function DifficultyButtons({
  difficulties,
  setGameParameters,
}: {
  difficulties: DifficultyParameter[];
  setGameParameters: React.Dispatch<React.SetStateAction<DifficultyParameter>>;
}) {
  //   return Object.entries(difficulties).map(([difficulty, values], idx) => {
  return difficulties.map((difficulty) => {
    return (
      <span>
        {/* {difficulty.title} {difficulty.snippetAmount} */}
        <DifficultyButton
          parameters={difficulty}
          setGameParameters={setGameParameters}
        ></DifficultyButton>
      </span>
    );
  });
  // return (
  //     <div className=""></div>
  // )
  //   return Object.entries(difficulties).map(
  //     ([difficulty, { snippetAmount, snippetLength }], idx) => {
  //       return (
  //         <DifficultyButton
  //           snippetAmount={snippetAmount}
  //           snippetLengthValue={snippetLength}
  //           difficulty={difficulty}
  //         ></DifficultyButton>
  //       );
  //     }
  //   );
  //   difficulties.map((difficulty, idx) => {
  //       return <DifficultyButton key={idx} difficulty={difficulty}></DifficultyButton>
  //   })
  //   <DifficultyButton></DifficultyButton>
  //   <DifficultyButton></DifficultyButton>
  //   <DifficultyButton></DifficultyButton>
  //   <DifficultyButton></DifficultyButton>
}
