"use client";

import { useEffect, useState } from "react";
import GameControls from "./InputGroup/GameControls";
import PlayingField from "./PlayingField/PlayingField";
import { WikiDocument } from "@/types/wiki";
import { Result } from "@/types/game";
import { useGameStatusContext } from "@/contexts/GameStatusContext";
import { db } from "@/db/init";

export default function Game({ wikiPages }: { wikiPages: WikiDocument[] }) {
  const context = useGameStatusContext();
  const [screen, setScreen] = useState<"lobby" | "game">("lobby");
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

    fetch("http://localhost:3000/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isVictory }),
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
    return (
      <GameControls
        setActiveAfterLoad={false}
        loadGame={async () => {
          handlePlayGame(wikiPages);
        }}
      />
    );
  }

  return (
    <PlayingField
      wikiPages={wikiPages}
      onMakeGuess={handleMakeGuess}
      onBack={handleBack}
    />
  );
}
