"use client";

import { motion } from "motion/react";
import PlayingField from "@/components/game/PlayingField/PlayingField";
import { useGameStatusContext } from "@/contexts/GameStatusContext";
import { Result } from "@/types/game";
import type { FetchState } from "../hooks/useGameData";
import { devIndicatorServerState } from "next/dist/server/dev/dev-indicator-server-state";

const SKELETON_WIDTHS = [100, 88, 94, 72, 86, 58, 78];

function LoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        height: "calc(100vh - 52px)",
        // alignItems: "center",
        justifyContent: "center",
        // padding: "32px 24px",
      }}
      className="mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <motion.div
          style={{ position: "relative", width: 56, height: 56 }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid var(--surface3)",
              borderTopColor: "var(--lime)",
              boxShadow: "0 0 24px var(--limeglow)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            style={{
              position: "absolute",
              inset: 10,
              borderRadius: "50%",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          style={{ textAlign: "center" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <p
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontSize: 28,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Loading <span style={{ color: "var(--lime)" }}>game</span>
          </p>
          <motion.p
            style={{
              color: "var(--textdim)",
              fontSize: 14,
              letterSpacing: "0.02em",
            }}
            animate={{ opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Preparing your round...
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          }}
          style={{
            width: "100%",
            padding: "20px 22px",
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, width: "40%" },
              show: {
                opacity: 1,
                width: "55%",
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            style={{
              height: 14,
              borderRadius: 6,
              background: "var(--surface3)",
            }}
          />
          {SKELETON_WIDTHS.map((width, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -10 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.12,
              }}
              style={{
                height: 9,
                width: `${width}%`,
                borderRadius: 5,
                background: "var(--surface3)",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function PlayContent({
  dataState,
  loadGame,
}: {
  dataState: FetchState;
  loadGame: () => void;
}) {
  const context = useGameStatusContext();

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

  if (dataState.status === "error") {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 20px 80px",
          color: "var(--text)",
        }}
      >
        {"ERRRor"}
      </div>
    );
  }

  console.log(dataState.status);

  if (dataState.status === "loading") {
    return <LoadingFallback />;
  }

  return (
    <PlayingField
      wikiPages={dataState.data.wikiPages}
      onBack={() => console.log("back")}
      onMakeGuess={handleMakeGuess}
      loadGame={loadGame}
    />
  );
}
