"use client";
import { Suspense } from "react";
import PlayContent from "./PlayContent";
import GameStatusContextProvider from "@/contexts/GameStatusContext";
import { useGameStore } from "../gameStore";
import GameControls from "@/components/game/InputGroup/GameControls";

function PlayFallback() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 20px 80px",
        color: "var(--text)",
      }}
    >
      Loading…
    </div>
  );
}

export default function PlayPage() {
  const { gameParams, isActive, beginNewGame } = useGameStore();

  const handleClickPlay = () => {
    beginNewGame();
  };

  return (
    <Suspense fallback={<PlayFallback />}>
      <GameStatusContextProvider>
        <GameControls />
        <button onClick={handleClickPlay}>PLAY</button>
        {isActive && <PlayContent />}
      </GameStatusContextProvider>
    </Suspense>
  );
}
