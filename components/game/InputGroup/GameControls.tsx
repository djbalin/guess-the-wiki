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
  medium: { numPages: 3, snippetLength: 30 },
  hard: { numPages: 4, snippetLength: 25 },
  extreme: { numPages: 5, snippetLength: 10 },
} as const;

const BTN_LIME =
  "bg-[var(--lime)] text-[var(--limedark)] border-0 rounded-xl font-black tracking-[1px] uppercase cursor-pointer transition-all duration-200 shadow-[0_4px_28px_var(--limeglow)] hover:brightness-110 hover:-translate-y-px hover:shadow-[0_6px_36px_var(--limeglow)] active:translate-y-0 disabled:bg-[var(--surface2)] disabled:text-[var(--textdim)] disabled:shadow-none disabled:cursor-not-allowed";

export default function GameControls({
  loadGame,
  compact = false,
}: {
  loadGame: () => Promise<void>;
  compact?: boolean;
}) {
  const { languageCode } = useLanguageContext();
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFF);
  const { setGameParams, gameParams } = useGameStore();

  function pickDifficulty(level: Difficulty) {
    setDifficulty(level);
    setGameParams({
      ...gameParams,
      numPages: DIFFICULTIES[level].numPages,
      snippetLength: DIFFICULTIES[level].snippetLength,
    });
  }

  const diffLabels = DIFFICULTY_DESCRIPTORS[languageCode];
  const handleChangeNumPages = (v: number) =>
    setGameParams({ ...gameParams, numPages: v });
  const handleChangeSnippetLength = (v: number) =>
    setGameParams({ ...gameParams, snippetLength: v });

  return (
    <div
      className={`animate-fade-up ${compact ? "pt-1 pb-4" : "max-w-[1200px] mx-auto mt-[60px] pb-20 px-5"}`}
    >
      <div className={compact ? "" : "max-w-4xl mx-auto"}>
        {/* Settings card */}
        <div
          className={`bg-[var(--surface)] border border-[var(--border)] rounded-[18px] flex flex-col ${compact ? "p-5 gap-[18px]" : "p-7 gap-[26px] max-w-[580px] mx-auto"}`}
        >
          {/* Difficulty presets */}
          <div>
            <Label>{GAME_SETTINGS[languageCode].difficulty}</Label>
            <div
              className={
                compact ? "flex flex-col gap-2" : "grid grid-cols-4 gap-2"
              }
            >
              {DIFFICULTY_LEVELS.map((level, i) => (
                <button
                  key={level}
                  onClick={() => pickDifficulty(level)}
                  className={`font-barlow font-black tracking-[0.5px] uppercase cursor-pointer transition-all duration-[150ms] rounded-[9px] px-1 ${compact ? "py-[9px] text-[14px]" : "py-[11px] text-[16px]"} ${
                    difficulty === level
                      ? "bg-[var(--lime)] text-[var(--limedark)] border border-[var(--lime)] shadow-[0_2px_16px_var(--limeglow)]"
                      : "bg-[var(--surface2)] text-[var(--textdim)] border border-[var(--border)]"
                  }`}
                >
                  {diffLabels[i as Difficulties]}
                </button>
              ))}
            </div>
          </div>

          {/* Fine-tune sliders */}
          <div className="flex flex-col gap-4">
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
          onClick={() => loadGame()}
          className={`${BTN_LIME} ${compact ? "mt-3 py-[14px] text-[18px]" : "mt-4 py-[18px] text-[21px]"} w-full flex items-center justify-center gap-[10px] rounded-[14px]`}
        >
          {GAME_SETTINGS[languageCode].play}
        </button>
      </div>
      <p className="text-center mt-[14px] text-[12px] text-[var(--textfaint)]">
        {gameParams.numPages} random Wikipedia articles ·{" "}
        {gameParams.snippetLength} words per snippet
      </p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-barlow text-[13px] font-bold tracking-[0.1em] uppercase text-[var(--textdim)] mb-[10px]">
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
      <div className="flex justify-between items-baseline mb-[10px]">
        <Label>{label}</Label>
        <span className="font-barlow text-[28px] font-black text-[var(--lime)] leading-none">
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
        className="w-full"
      />
    </div>
  );
}
