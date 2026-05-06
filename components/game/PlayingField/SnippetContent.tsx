import { WikiDocument } from "@/types/wiki";

function renderSnippet(text: string | null) {
  if (!text) return null;
  const parts = text.split("###");
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <span className="censor">████████</span>}
    </span>
  ));
}

interface Props {
  wikiPageObject: WikiDocument;
  assignedTitle: WikiDocument | null;
  result: boolean | null;
  cardClass: string;
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
  cardClass,
  isDragOver,
  hasIncoming,
  showSol,
  snippetIndex,
  totalSnippets,
  phase,
  htmlId,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: Props) {
  return (
    <div
      id={htmlId}
      className={cardClass}
      onDragOver={onDragOver}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onDragLeave();
      }}
      onDrop={onDrop}
      onClick={onClick}
      style={{
        cursor:
          hasIncoming || (assignedTitle && phase !== "result")
            ? "pointer"
            : "default",
      }}
    >
      {/* Drop slot */}
      <div className="drop-slot">
        {assignedTitle ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
            }}
          >
            <span
              style={{
                background:
                  result === true
                    ? "var(--green)"
                    : result === false
                      ? "var(--red)"
                      : "var(--blue)",
                color: "white",
                padding: "5px 16px",
                borderRadius: 99,
                fontSize: 13.5,
                fontWeight: 700,
                flex: 1,
                textAlign: "center",
                boxShadow:
                  result === true
                    ? "0 2px 10px var(--greenglow)"
                    : result === false
                      ? "0 2px 10px var(--redglow)"
                      : "0 2px 10px var(--blueglow)",
              }}
            >
              {assignedTitle.title}
            </span>
            {result === true && (
              <span style={{ fontSize: 18, color: "var(--green)" }}>✓</span>
            )}
            {result === false && (
              <span style={{ fontSize: 18, color: "var(--red)" }}>✗</span>
            )}
          </div>
        ) : (
          <span
            style={{
              fontSize: 12,
              fontStyle: "italic",
              color: isDragOver ? "oklch(72% 0.17 248)" : "var(--textfaint)",
              transition: "color 0.15s",
            }}
          >
            {isDragOver
              ? "Release to assign"
              : hasIncoming
                ? "Drop here…"
                : "No title assigned"}
          </span>
        )}
      </div>

      {/* Solution strip */}
      {showSol && (
        <div
          style={{
            background: "var(--greenbg)",
            padding: "6px 14px",
            borderBottom: "1px solid oklch(58% 0.18 145 / 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              color: "var(--green)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            Answer
          </span>
          <a
            href={wikiPageObject.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: "var(--green)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {wikiPageObject.title} ↗
          </a>
        </div>
      )}

      {/* Snippet text */}
      <div
        style={{
          padding: "15px 17px",
          flex: 1,
          fontFamily: "var(--font-spectral), Georgia, serif",
          fontSize: 15,
          lineHeight: 1.75,
          color: "var(--text)",
        }}
      >
        {renderSnippet(wikiPageObject.content_censored)}
      </div>

      {/* Footer */}
      {/* <div
        style={{
          padding: "6px 14px",
          borderTop: "1px solid var(--border)",
          fontSize: 10.5,
          color: "var(--textfaint)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.04em",
        }}
      >
        Snippet {snippetIndex} of {totalSnippets}
      </div> */}
    </div>
  );
}
