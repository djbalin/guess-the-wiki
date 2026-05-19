"use client";
import { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { DIFFICULTY_DESCRIPTORS, GAME_SETTINGS } from "@/assets/strings";
import { Difficulties } from "@/types/game";
import { useGameStore } from "@/app/gameStore";

const DIFFICULTY_LEVELS = ["easy", "medium", "hard", "extreme"] as const;
type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

const DEFAULT_DIFF: Difficulty = "medium";

const DIFFICULTIES: {
  [key in Difficulty]: { numPages: number; snippetLength: number };
} = {
  easy: { numPages: 2, snippetLength: 50 },
  medium: { numPages: 3, snippetLength: 40 },
  hard: { numPages: 4, snippetLength: 25 },
  extreme: { numPages: 5, snippetLength: 10 },
} as const;

export default function GameControls() {
  const { languageCode } = useLanguageContext();
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFF);

  const { setGameParams, gameParams, setIsActive } = useGameStore();
  // const [numPages, setNumPages] = useState(DIFFICULTIES[DEFAULT_DIFF].numPages);
  // const [snippetLength, setSnippetLength] = useState(
  //   DIFFICULTIES[DEFAULT_DIFF].snippetLength,
  // );
  const [loading, setLoading] = useState(false);

  function pickDifficulty(level: Difficulty) {
    setDifficulty(level);
    // const level = DIFFICULTY_LEVELS[i];
    setGameParams({
      ...gameParams,
      numPages: DIFFICULTIES[level].numPages,
      snippetLength: DIFFICULTIES[level].snippetLength,
    });
  }

  async function handlePlay() {
    setLoading(true);
    setLoading(false);
    setIsActive(true);
  }

  const diffLabels = DIFFICULTY_DESCRIPTORS[languageCode];

  const handleChangeNumPages = (newVal: number) => {
    setGameParams({ ...gameParams, numPages: newVal });
  };
  const handleChangeSnippetLength = (newVal: number) => {
    setGameParams({ ...gameParams, snippetLength: newVal });
  };

  return (
    <div
      className="fade-up"
      style={{
        maxWidth: 1200,
        margin: "60px auto 0",
        padding: "0 20px 80px",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Settings card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 26,
            maxWidth: 580,
            margin: "0 auto",
          }}
        >
          {/* Difficulty presets */}
          <div>
            <Label>{GAME_SETTINGS[languageCode].difficulty}</Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {DIFFICULTY_LEVELS.map((level, i) => (
                <button
                  key={level}
                  onClick={() => pickDifficulty(level)}
                  style={{
                    background:
                      difficulty === level ? "var(--lime)" : "var(--surface2)",
                    color:
                      difficulty === level
                        ? "var(--limedark)"
                        : "var(--textdim)",
                    border:
                      difficulty === level
                        ? "1px solid var(--lime)"
                        : "1px solid var(--border)",
                    borderRadius: 9,
                    padding: "11px 4px",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow:
                      difficulty === level
                        ? "0 2px 16px var(--limeglow)"
                        : "none",
                  }}
                >
                  {diffLabels[i as Difficulties]}
                </button>
              ))}
            </div>
          </div>

          {/* Fine-tune sliders */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}
          >
            <Slider
              label={GAME_SETTINGS[languageCode].numPages}
              min={2}
              max={5}
              step={1}
              value={gameParams.numPages}
              onChange={handleChangeNumPages}
            />
            <Slider
              label={GAME_SETTINGS[languageCode].snippetLength}
              min={5}
              max={50}
              step={5}
              value={gameParams.snippetLength}
              onChange={handleChangeSnippetLength}
            />
          </div>
        </div>

        {/* Play CTA */}
        <button
          onClick={handlePlay}
          disabled={loading}
          className="btn-lime"
          style={{
            marginTop: 16,
            width: "100%",
            padding: "18px 0",
            borderRadius: 14,
            fontSize: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {loading ? (
            <>
              <SpinIcon /> Fetching articles…
            </>
          ) : (
            GAME_SETTINGS[languageCode].play
          )}
        </button>
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 18,
          fontSize: 12.5,
          color: "var(--textfaint)",
        }}
      >
        {gameParams.numPages} random Wikipedia articles ·{" "}
        {gameParams.snippetLength} words per snippet
      </p>
    </div>
  );
}

function SpinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      style={{ animation: "spin 0.75s linear infinite", flexShrink: 0 }}
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="2.5"
      />
      <path
        d="M9 2a7 7 0 0 1 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-barlow-condensed), sans-serif",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--textdim)",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <Label>{label}</Label>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontSize: 28,
            fontWeight: 900,
            color: "var(--lime)",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}
