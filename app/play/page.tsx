"use client";
import { Suspense } from "react";
import PlayContent from "./PlayContent";
import GameStatusContextProvider from "@/contexts/GameStatusContext";
import { useGameStore } from "../gameStore";
import GameControls from "@/components/game/InputGroup/GameControls";
import { useGameData } from "../hooks/useGameData";

function PlayFallback() {
  return (
    <div style={{ padding: "24px 20px", color: "var(--text)" }}>
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
        <div
          style={{
            display: "flex",
            height: "calc(100vh - 52px)",
            overflow: "hidden",
          }}
        >
          {/* Left sidebar — game controls */}
          <div
            style={{
              width: 300,
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
              overflowY: "auto",
              padding: "20px 16px",
            }}
          >
            <GameControls loadGame={loadGame} compact />
          </div>

          {/* Right — playing field */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {isActive && <PlayContent loadGame={loadGame} dataState={dataState} />}
          </div>
        </div>
      </GameStatusContextProvider>
    </Suspense>
  );
}
