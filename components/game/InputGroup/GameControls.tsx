"use client";
import { useState } from "react";
import { WikiDocument } from "@/resources/TypesEnums";
import { fetchAndSnippetRandomWikiPages } from "@/scripts/api_helper";
import { useLanguageContext } from "@/contexts/LanguageContext";
import {
  DIFFICULTY_DESCRIPTORS,
  GAME_DESCRIPTION,
  GAME_SETTINGS,
} from "@/assets/strings";

interface Props {
  onPlayGame: (wikiPages: WikiDocument[]) => void;
}

const DIFFS = [
  { snippetAmount: 2, snippetLength: 50 },
  { snippetAmount: 3, snippetLength: 40 },
  { snippetAmount: 4, snippetLength: 25 },
  { snippetAmount: 5, snippetLength: 10 },
];

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

export default function GameControls({ onPlayGame }: Props) {
  const { languageCode } = useLanguageContext();
  const [diffIdx, setDiffIdx] = useState(1);
  const [snippetAmount, setSnippetAmount] = useState(DIFFS[1].snippetAmount);
  const [snippetLength, setSnippetLength] = useState(DIFFS[1].snippetLength);
  const [loading, setLoading] = useState(false);

  function pickDiff(i: number) {
    setDiffIdx(i);
    setSnippetAmount(DIFFS[i].snippetAmount);
    setSnippetLength(DIFFS[i].snippetLength);
  }

  async function handlePlay() {
    setLoading(true);
    const wikiDocuments = await fetchAndSnippetRandomWikiPages(
      snippetAmount,
      snippetLength,
      languageCode,
    );
    setLoading(false);
    onPlayGame(wikiDocuments);
  }

  const diffLabels = DIFFICULTY_DESCRIPTORS[languageCode];

  return (
    <div
      className="fade-up"
      style={{
        maxWidth: 1200,
        margin: "60px auto 0",
        padding: "0 20px 80px",
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 0.92,
            textTransform: "uppercase",
            letterSpacing: "-1px",
            marginBottom: 20,
          }}
        >
          <span>Guess the</span>
          <br />
          <span
            style={{
              color: "var(--lime)",
              textShadow: "0 0 40px var(--limeglow)",
            }}
          >
            Wikipedia
          </span>
          <br />
          <span>Article!</span>
        </div>
        <p
          style={{
            color: "var(--textdim)",
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          {GAME_DESCRIPTION[languageCode].body}
        </p>
      </div>

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
              {([0, 1, 2, 3] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => pickDiff(i)}
                  style={{
                    background:
                      diffIdx === i ? "var(--lime)" : "var(--surface2)",
                    color: diffIdx === i ? "var(--limedark)" : "var(--textdim)",
                    border:
                      diffIdx === i
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
                      diffIdx === i ? "0 2px 16px var(--limeglow)" : "none",
                  }}
                >
                  {diffLabels[i]}
                </button>
              ))}
            </div>
          </div>

          {/* Fine-tune sliders */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}
          >
            <Slider
              label={GAME_SETTINGS[languageCode].snippetCount}
              min={2}
              max={5}
              step={1}
              value={snippetAmount}
              onChange={(v) => {
                setSnippetAmount(v);
                setDiffIdx(-1);
              }}
            />
            <Slider
              label={GAME_SETTINGS[languageCode].snippetLength}
              min={5}
              max={50}
              step={5}
              value={snippetLength}
              onChange={(v) => {
                setSnippetLength(v);
                setDiffIdx(-1);
              }}
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
        {snippetAmount} random Wikipedia articles · {snippetLength} words per
        snippet
      </p>
    </div>
  );
}
