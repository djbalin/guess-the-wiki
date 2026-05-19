"use client";
import { Suspense } from "react";
import PlayContent from "./PlayContent";
import GameStatusContextProvider from "@/contexts/GameStatusContext";
import { useGameStore } from "../gameStore";
import GameControls from "@/components/game/InputGroup/GameControls";
import { useGameData } from "../hooks/useGameData";

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
  const { isActive } = useGameStore();
  const { dataState, loadGame } = useGameData();

  return (
    <Suspense fallback={<PlayFallback />}>
      <GameStatusContextProvider>
        <GameControls loadGame={loadGame} />
        {isActive && <PlayContent dataState={dataState} />}
      </GameStatusContextProvider>
    </Suspense>
  );
}
