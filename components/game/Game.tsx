"use client";

import { useEffect, useState } from "react";
import GameControls from "./InputGroup/GameControls";
import PlayingField from "./PlayingField/PlayingField";
import { Result, WikiDocument } from "@/resources/TypesEnums";
import { useGameStatusContext } from "@/contexts/GameStatusContext";

function shuffleArray(arr: any[], accumulator: any[]): any[] {
  if (arr.length === 0) return accumulator;
  const idx = Math.floor(Math.random() * arr.length);
  const el = arr[idx];
  accumulator.push(el);
  return shuffleArray(arr.toSpliced(idx, 1), accumulator);
}

function produceRandomArrayIndices(length: number): number[] {
  return shuffleArray(
    Array.from({ length }, (_, i) => i),
    []
  );
}

export default function Game() {
  const context = useGameStatusContext();
  const [screen, setScreen] = useState<"lobby" | "game">("lobby");
  const [wikiPageObjects, setWikiPageObjects] = useState<WikiDocument[]>([]);
  const [randomizerArray, setRandomizerArray] = useState<number[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 865);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handlePlayGame(wikiPages: WikiDocument[]) {
    setWikiPageObjects(wikiPages);
    setRandomizerArray(produceRandomArrayIndices(wikiPages.length));
    context.setGameStatusContext({
      showPlayingField: true,
      guessHasBeenMade: false,
      result: Result.Ongoing,
      revealSolution: false,
    });
    setScreen("game");
  }

  function handleBack() {
    setScreen("lobby");
    context.setGameStatusContext({
      showPlayingField: false,
      guessHasBeenMade: false,
      result: Result.Ongoing,
      revealSolution: false,
    });
  }

  function handleMakeGuess(isVictory: boolean) {
    context.setGameStatusContext({
      showPlayingField: true,
      guessHasBeenMade: true,
      result: isVictory ? Result.Victory : Result.Loss,
      revealSolution: isVictory,
    });
  }

  if (isSmallScreen) {
    return (
      <div
        style={{
          background: "var(--redbg)",
          border: "1px solid var(--red)",
          borderRadius: 14,
          padding: "2rem",
          margin: "4rem auto",
          maxWidth: 480,
          textAlign: "center",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text)",
          letterSpacing: "0.05em",
        }}
      >
        This game is not optimized for small screens yet.
        <br />
        Please play on a larger screen!
      </div>
    );
  }

  if (screen === "lobby") {
    return <GameControls onPlayGame={handlePlayGame} />;
  }

  return (
    <PlayingField
      wikiPages={wikiPageObjects}
      randomizerArray={randomizerArray}
      onMakeGuess={handleMakeGuess}
      onBack={handleBack}
    />
  );
}
