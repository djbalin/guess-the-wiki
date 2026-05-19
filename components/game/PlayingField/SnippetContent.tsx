import { IS_DEV } from "@/lib/is_dev";
import { WikiDocument } from "@/types/wiki";

const CARD_BASE =
  "rounded-[14px] overflow-hidden transition-[border-color,background,box-shadow] duration-200 flex flex-col border";

function getCardClass(
  result: boolean | null,
  isDragOver: boolean,
  hasIncoming: boolean,
  assignedTitle: WikiDocument | null,
) {
  if (isDragOver && hasIncoming)
    return `${CARD_BASE} border-[var(--blue)] shadow-[0_0_0_3px_var(--blueglow)] bg-[var(--bluebg)]`;
  if (result === true)
    return `${CARD_BASE} border-[var(--green)] bg-[var(--greenbg)] shadow-[0_0_0_2px_var(--greenglow)]`;
  if (result === false)
    return `${CARD_BASE} border-[var(--red)] bg-[var(--redbg)] shadow-[0_0_0_2px_var(--redglow)]`;
  if (assignedTitle)
    return `${CARD_BASE} border-[var(--blue-border)] bg-[var(--bluebg)] shadow-[0_0_0_1px_var(--blueglow)]`;
  return `${CARD_BASE} border-[var(--border)] bg-[var(--surface)]`;
}

const DROP_BASE =
  "min-h-12 flex items-center justify-center px-3 sm:px-[14px] py-2 sm:py-[10px] border-b transition-[background] duration-200";

function getDropSlotClass(
  result: boolean | null,
  isDragOver: boolean,
  hasIncoming: boolean,
  assignedTitle: WikiDocument | null,
) {
  if (isDragOver && hasIncoming)
    return `${DROP_BASE} bg-[var(--drop)] [border-bottom-color:var(--border)]`;
  if (result === true)
    return `${DROP_BASE} bg-[var(--slot-ok-bg)] [border-bottom-color:var(--green-border)]`;
  if (result === false)
    return `${DROP_BASE} bg-[var(--slot-bad-bg)] [border-bottom-color:var(--red-border)]`;
  if (assignedTitle)
    return `${DROP_BASE} bg-[var(--surface2)] [border-bottom-color:var(--blue-border)]`;
  return `${DROP_BASE} bg-[var(--slot-bg)] [border-bottom-color:var(--border)]`;
}

function renderSnippet(text: string | null) {
  if (!text) return null;
  const parts = text.split("###");
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <span className="inline-block bg-[var(--text)] text-transparent rounded-[3px] px-[3px] py-px mx-px tracking-[0.08em] align-baseline select-none opacity-20">
          ██
        </span>
      )}
    </span>
  ));
}

interface Props {
  wikiPageObject: WikiDocument;
  assignedTitle: WikiDocument | null;
  result: boolean | null;
  isDragOver: boolean;
  hasIncoming: boolean;
  showSol: boolean;
  snippetIndex: number;
  totalSnippets: number;
  phase: "playing" | "result";
  htmlId: string;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

export default function SnippetContent({
  wikiPageObject,
  assignedTitle,
  result,
  isDragOver,
  hasIncoming,
  showSol,
  phase,
  htmlId,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: Props) {
  const cardClass = getCardClass(
    result,
    isDragOver,
    hasIncoming,
    assignedTitle,
  );
  const dropSlotClass = getDropSlotClass(
    result,
    isDragOver,
    hasIncoming,
    assignedTitle,
  );

  const titleBadgeColor =
    result === true
      ? "bg-[var(--green)] shadow-[0_2px_10px_var(--greenglow)]"
      : result === false
        ? "bg-[var(--red)] shadow-[0_2px_10px_var(--redglow)]"
        : "bg-[var(--blue)] shadow-[0_2px_10px_var(--blueglow)]";

  return (
    <div
      id={htmlId}
      className={`${cardClass} ${hasIncoming || (assignedTitle && phase !== "result") ? "cursor-pointer" : "cursor-default"}`}
      onDragOver={onDragOver}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onDragLeave();
      }}
      onDrop={onDrop}
      onClick={onClick}
    >
      {/* Drop slot */}
      <div className={dropSlotClass}>
        {assignedTitle ? (
          <div className="flex items-center gap-2 w-full">
            <span
              className={`${titleBadgeColor} text-white py-1 px-3 sm:px-4 rounded-full text-sm sm:text-lg font-bold flex-1 text-center truncate`}
            >
              {assignedTitle.title}
            </span>
            {result === true && (
              <span className="text-[16px] sm:text-[18px] text-[var(--green)] shrink-0">
                ✓
              </span>
            )}
            {result === false && (
              <span className="text-[16px] sm:text-[18px] text-[var(--red)] shrink-0">
                ✗
              </span>
            )}
          </div>
        ) : (
          <span
            className={`text-xs sm:text-sm italic transition-colors duration-[150ms] text-center ${isDragOver ? "text-[oklch(72%_0.17_248)]" : "text-[var(--textfaint)]"}`}
          >
            {isDragOver
              ? "Release to assign"
              : hasIncoming
                ? "Place here…"
                : "No title assigned"}
          </span>
        )}
      </div>

      {/* Solution strip */}
      {showSol && (
        <div className="bg-[var(--greenbg)] px-3 sm:px-[14px] py-1.5 sm:py-[6px] border-b border-b-[oklch(58%_0.18_145/0.3)] flex items-center gap-2 flex-wrap">
          <span className="text-[10.5px] text-[var(--green)] font-bold uppercase tracking-[0.08em] shrink-0">
            Answer
          </span>
          <a
            href={wikiPageObject.fullurl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[var(--green)] text-[12.5px] sm:text-[13px] font-semibold no-underline break-words"
          >
            {wikiPageObject.title} ↗
          </a>
        </div>
      )}

      {/* Snippet text */}
      <div className="p-3 sm:p-4 flex-1 font-spectral text-[13.5px] sm:text-[15px] leading-[1.65] sm:leading-[1.75] text-[var(--text)]">
        {renderSnippet(wikiPageObject.content_censored)}
      </div>
      {IS_DEV && (
        <div className="text-xs text-[var(--textfaint)] px-4 pb-2">
          Id: {wikiPageObject.pageid}
        </div>
      )}
    </div>
  );
}
