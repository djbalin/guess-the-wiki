"use client";
import { useMemo, useRef, useState } from "react";
import SnippetContent from "./SnippetContent";
import { WikiDocument } from "@/types/wiki";

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

const BTN_LIME =
  "bg-[var(--lime)] text-[var(--limedark)] rounded-xl font-bold uppercase cursor-pointer disabled:bg-[var(--surface2)] disabled:text-[var(--textdim)]";

const PILL_BASE =
  "list-none px-[18px] py-2 rounded-full text-[22px] font-bold select-none whitespace-nowrap transition-[opacity,transform,box-shadow] duration-200 active:cursor-grabbing";

function getPillClass(used: boolean, selected: boolean, phase: string) {
  if (used)
    return `${PILL_BASE} opacity-[0.28] cursor-default pointer-events-none bg-[var(--surface2)] text-[var(--textdim)]`;
  if (selected)
    return `${PILL_BASE} scale-[1.08] cursor-grab bg-[var(--blue-selected)] text-white shadow-[0_0_0_2px_white,0_0_0_5px_var(--blue),0_4px_20px_var(--blueglow)]`;
  const normal = `${PILL_BASE} cursor-grab bg-[var(--blue)] text-white shadow-[0_2px_12px_var(--blueglow)]`;
  return phase === "result" ? `${normal} pointer-events-none` : normal;
}

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

interface Props {
  wikiPages: WikiDocument[];
  onMakeGuess: (isVictory: boolean) => void;
  onBack: () => void;
  loadGame: () => void;
}

export default function PlayingField({
  wikiPages,
  onMakeGuess,
  onBack,
  loadGame,
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

  const randomizerArray = useMemo(
    () => produceRandomArrayIndices(wikiPages.length),
    [wikiPages],
  );

  const currentlyDragging = useRef<string | null>(null);

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
    if (assignments[snippetId]) unassign(snippetId);
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
  }

  const cols = Math.min(wikiPages.length, 4);

  return (
    <div className="animate-fade-up px-7 py-5 pb-12 max-w-[1400px] mx-auto">
      {/* Titles bar */}
      <div
        className={`flex items-stretch gap-3 mb-[18px] ${shaking ? "animate-shake" : ""}`}
      >
        <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-[10px] flex items-center gap-[10px] flex-wrap min-h-14">
          <span className="font-barlow text-[13px] font-black tracking-[0.12em] uppercase text-[var(--textdim)] shrink-0 mr-0.5">
            Titles
          </span>

          <div className="flex flex-row justify-around w-full xl:mx-20">
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
                  className={getPillClass(used, selected, phase)}
                >
                  {page.title}
                </li>
              );
            })}
          </div>

          <span
            className={`ml-auto shrink-0 font-barlow text-[15px] font-black tracking-[0.05em] uppercase transition-[color,text-shadow] duration-300 ${numPlaced === wikiPages.length ? "text-[var(--lime)] [text-shadow:0_0_12px_var(--limeglow)]" : "text-[var(--textdim)]"}`}
          >
            {numPlaced}/{wikiPages.length} placed
          </span>
        </div>
      </div>

      {/* Result banner */}
      {phase === "result" && (
        <div
          className={`animate-pop rounded-[10px] px-5 py-[14px] mb-4 flex items-center justify-between gap-4 border ${isVictory ? "bg-[var(--greenbg)] border-[var(--green)]" : "bg-[var(--redbg)] border-[var(--red)]"}`}
        >
          <div>
            <div
              className={`font-barlow font-black text-[22px] tracking-[0.5px] uppercase mb-1 ${isVictory ? "text-[var(--green)]" : "text-[var(--red)]"}`}
            >
              {isVictory
                ? "🎉 Perfect Score! All articles matched."
                : "❌ Not quite — some matches were wrong!"}
            </div>
            <div className="text-[13.5px] text-[var(--textdim)]">
              {isVictory
                ? `You matched all ${wikiPages.length} Wikipedia articles correctly.`
                : "Incorrect cards are outlined in red. Reveal the solution below to check answers."}
            </div>
          </div>
          {!isVictory && (
            <button
              onClick={handleReset}
              className="bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] rounded-lg px-[18px] py-2 text-[13px] font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              Try Same Game Again
            </button>
          )}
        </div>
      )}

      {/* Snippet grid */}
      <div className={`grid ${GRID_COLS[cols] ?? "grid-cols-4"} gap-[10px]`}>
        {randomizedContentHtmlIds.map((snippetId, idx) => {
          const page = contentHtmlIdsAndPages[snippetId];
          const assignedTitleId = assignments[snippetId];
          const assignedTitle = assignedTitleId
            ? titleHtmlIdsAndPages[assignedTitleId]
            : null;
          const result =
            phase === "result" ? (cardResults[snippetId] ?? null) : null;
          const isOver = dragoverSnippet === snippetId;

          return (
            <SnippetContent
              key={snippetId}
              htmlId={snippetId}
              wikiPageObject={page}
              assignedTitle={assignedTitle}
              result={result}
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onBack}
          className="bg-transparent text-[var(--textdim)] border-0 text-[13.5px] cursor-pointer"
        >
          ← New game
        </button>

        <div className="flex items-center shrink-0">
          {phase === "playing" ? (
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`${BTN_LIME} px-[26px] h-full rounded-[10px] text-[19px]`}
            >
              Submit →
            </button>
          ) : (
            <div className="gap-4 flex flex-row">
              <button
                onClick={loadGame}
                className={`${BTN_LIME} px-[22px] h-full rounded-[10px] text-[17px]`}
              >
                Play New Game
              </button>

              {!isVictory && (
                <>
                  <button
                    onClick={handleReset}
                    className="bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] rounded-[10px] px-5 h-full text-[15px] font-semibold cursor-pointer whitespace-nowrap"
                  >
                    ↩ Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowSolution((s) => !s)}
          className={`border border-[var(--border)] rounded-lg px-4 py-[7px] text-[13px] cursor-pointer transition-all duration-[150ms] ${showSolution ? "bg-[var(--surface2)] text-[var(--text)]" : "bg-transparent text-[var(--textdim)]"}`}
        >
          {showSolution ? "🙈 Hide solution" : "👁 Reveal solution"}
        </button>
      </div>
    </div>
  );
}
