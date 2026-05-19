"use client";
import { useMemo, useRef, useState } from "react";
import SnippetContent from "./SnippetContent";
import { WikiDocument } from "@/types/wiki";
import { useRouter, useSearchParams } from "next/navigation";

function shuffleArray<T>(arr: Array<T>, accumulator: Array<T>): Array<T> {
  if (arr.length === 0) return accumulator;
  const idx = Math.floor(Math.random() * arr.length);
  const el = arr[idx];
  accumulator.push(el);
  return shuffleArray(arr.toSpliced(idx, 1), accumulator);
}

function produceRandomArrayIndices(length: number): number[] {
  return shuffleArray(
    Array.from({ length }, (_, i) => i),
    [],
  );
}

interface Props {
  wikiPages: WikiDocument[];
  onMakeGuess: (isVictory: boolean) => void;
  onBack: () => void;
}

export default function PlayingField({
  wikiPages,
  onMakeGuess,
  onBack,
}: Props) {
  const [assignments, setAssignments] = useState<{
    [snippetId: string]: string;
  }>({});
  const [cardResults, setCardResults] = useState<{
    [snippetId: string]: boolean;
  }>({});
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [showSolution, setShowSolution] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [dragoverSnippet, setDragoverSnippet] = useState<string | null>(null);
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const randomizerArray = useMemo(
    () => produceRandomArrayIndices(wikiPages.length),
    [wikiPages],
  );

  const currentlyDragging = useRef<string | null>(null);

  // Build deterministic ID maps from wikiPages (stable across renders while pages don't change)
  const contentHtmlIdsAndPages: { [key: string]: WikiDocument } = {};
  const titleHtmlIdsAndPages: { [key: string]: WikiDocument } = {};
  wikiPages.forEach((page, i) => {
    contentHtmlIdsAndPages[`s${i + 1}`] = page;
    titleHtmlIdsAndPages[`t${i + 1}`] = page;
  });

  const contentHtmlIds = Object.keys(contentHtmlIdsAndPages);
  const randomizedContentHtmlIds = randomizerArray.map(
    (rnd) => contentHtmlIds[rnd],
  );

  const usedTitleIds = new Set(Object.values(assignments));
  const numPlaced = Object.keys(assignments).length;
  const isComplete = numPlaced === wikiPages.length;
  const isVictory =
    phase === "result" && Object.values(cardResults).every(Boolean);
  const hasIncoming = isDraggingActive || selectedTitleId !== null;

  function assign(snippetId: string, titleId: string) {
    setAssignments((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(next)) {
        if (v === titleId) delete next[k];
      }
      next[snippetId] = titleId;
      return next;
    });
    setSelectedTitleId(null);
  }

  function unassign(snippetId: string) {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[snippetId];
      return next;
    });
  }

  function handleDragStart(e: React.DragEvent, titleId: string) {
    e.dataTransfer.effectAllowed = "move";
    currentlyDragging.current = titleId;
    setIsDraggingActive(true);
    setSelectedTitleId(null);
  }

  function handleDragEnd() {
    currentlyDragging.current = null;
    setIsDraggingActive(false);
    setDragoverSnippet(null);
  }

  function handleDrop(snippetId: string) {
    const incoming = currentlyDragging.current ?? selectedTitleId;
    if (!incoming) return;
    assign(snippetId, incoming);
    currentlyDragging.current = null;
    setIsDraggingActive(false);
    setDragoverSnippet(null);
  }

  function handleClickTitle(titleId: string) {
    if (phase === "result" || usedTitleIds.has(titleId)) return;
    setSelectedTitleId((prev) => (prev === titleId ? null : titleId));
  }

  function handleClickSnippet(snippetId: string) {
    if (phase === "result") return;
    if (selectedTitleId) {
      assign(snippetId, selectedTitleId);
      return;
    }
    if (assignments[snippetId]) {
      unassign(snippetId);
    }
  }

  function handleSubmit() {
    if (!isComplete) {
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }
    const results: { [snippetId: string]: boolean } = {};
    for (const [snippetId, titleId] of Object.entries(assignments)) {
      results[snippetId] = snippetId.substring(1) === titleId.substring(1);
    }
    setCardResults(results);
    setPhase("result");
    onMakeGuess(Object.values(results).every(Boolean));
  }

  function handleReset() {
    setAssignments({});
    setCardResults({});
    setPhase("playing");
    setShowSolution(false);
    setSelectedTitleId(null);
    setDragoverSnippet(null);
    setIsDraggingActive(false);
    params.delete("seed");

    router.replace(`?${params.toString()}`);
  }

  const cols = Math.min(wikiPages.length, 4);

  return (
    <div
      className="fade-up"
      style={{ padding: "20px 28px 48px", maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Titles bar */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 12,
          marginBottom: 18,
        }}
        className={shaking ? "shake" : ""}
      >
        <div
          style={{
            flex: 1,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            minHeight: 56,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--textdim)",
              flexShrink: 0,
              marginRight: 2,
            }}
          >
            Titles
          </span>

          {Object.entries(titleHtmlIdsAndPages).map(([titleId, page]) => {
            const used = usedTitleIds.has(titleId);
            const selected = selectedTitleId === titleId;
            return (
              <li
                key={titleId}
                draggable={!used && phase !== "result"}
                onDragStart={(e) => handleDragStart(e, titleId)}
                onDragEnd={handleDragEnd}
                onClick={() => handleClickTitle(titleId)}
                className={[
                  "title-pill",
                  used ? "used" : "",
                  selected ? "selected" : "",
                  phase === "result" ? "disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {page.title}
              </li>
            );
          })}

          <span
            style={{
              marginLeft: "auto",
              flexShrink: 0,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontSize: 15,
              fontWeight: 900,
              color:
                numPlaced === wikiPages.length
                  ? "var(--lime)"
                  : "var(--textdim)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textShadow:
                numPlaced === wikiPages.length
                  ? "0 0 12px var(--limeglow)"
                  : "none",
              transition: "color 0.3s, text-shadow 0.3s",
            }}
          >
            {numPlaced}/{wikiPages.length} placed
          </span>
        </div>

        {/* Action button */}
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {phase === "playing" ? (
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="btn-lime"
              style={{
                padding: "0 26px",
                height: "100%",
                borderRadius: 10,
                fontSize: 19,
              }}
            >
              Submit →
            </button>
          ) : isVictory ? (
            <button
              onClick={handleReset}
              className="btn-lime"
              style={{
                padding: "0 22px",
                height: "100%",
                borderRadius: 10,
                fontSize: 17,
              }}
            >
              Play Again
            </button>
          ) : (
            <button
              onClick={handleReset}
              style={{
                background: "var(--surface2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "0 20px",
                height: "100%",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              ↩ Try Again
            </button>
          )}
        </div>
      </div>

      {/* Result banner */}
      {phase === "result" && (
        <div
          className="pop"
          style={{
            background: isVictory ? "var(--greenbg)" : "var(--redbg)",
            border: `1px solid ${isVictory ? "var(--green)" : "var(--red)"}`,
            borderRadius: 10,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: 22,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: isVictory ? "var(--green)" : "var(--red)",
                marginBottom: 4,
              }}
            >
              {isVictory
                ? "🎉 Perfect Score! All articles matched."
                : "❌ Not quite — some matches were wrong!"}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--textdim)" }}>
              {isVictory
                ? `You matched all ${wikiPages.length} Wikipedia articles correctly.`
                : "Incorrect cards are outlined in red. Reveal the solution below to check answers."}
            </div>
          </div>
          {!isVictory && (
            <button
              onClick={handleReset}
              style={{
                background: "var(--surface2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), sans-serif",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Snippet grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 10,
        }}
      >
        {randomizedContentHtmlIds.map((snippetId, idx) => {
          const page = contentHtmlIdsAndPages[snippetId];
          const assignedTitleId = assignments[snippetId];
          const assignedTitle = assignedTitleId
            ? titleHtmlIdsAndPages[assignedTitleId]
            : null;
          const result =
            phase === "result" ? (cardResults[snippetId] ?? null) : null;
          const isOver = dragoverSnippet === snippetId;

          let cardClass = "snippet-card";
          if (isOver && hasIncoming) cardClass += " dragover";
          else if (result === true) cardClass += " result-ok";
          else if (result === false) cardClass += " result-bad";
          else if (assignedTitle) cardClass += " assigned";

          return (
            <SnippetContent
              key={snippetId}
              htmlId={snippetId}
              wikiPageObject={page}
              assignedTitle={assignedTitle}
              result={result}
              cardClass={cardClass}
              isDragOver={isOver && hasIncoming}
              hasIncoming={hasIncoming}
              showSol={showSolution}
              snippetIndex={idx + 1}
              totalSnippets={wikiPages.length}
              phase={phase}
              onDragOver={(e) => {
                e.preventDefault();
                setDragoverSnippet(snippetId);
              }}
              onDragLeave={() => {
                if (dragoverSnippet === snippetId) setDragoverSnippet(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(snippetId);
              }}
              onClick={() => handleClickSnippet(snippetId)}
            />
          );
        })}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            color: "var(--textdim)",
            border: "none",
            fontSize: 13.5,
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          ← New game
        </button>
        <button
          onClick={() => setShowSolution((s) => !s)}
          style={{
            background: showSolution ? "var(--surface2)" : "transparent",
            color: showSolution ? "var(--text)" : "var(--textdim)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "7px 16px",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), sans-serif",
            transition: "all 0.15s",
          }}
        >
          {showSolution ? "🙈 Hide solution" : "👁 Reveal solution"}
        </button>
      </div>
    </div>
  );
}
