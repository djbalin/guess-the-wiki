"use client";

import PlayingField from "@/components/game/PlayingField/PlayingField";
import { useGameStatusContext } from "@/contexts/GameStatusContext";
import { Result } from "@/types/game";
import { useGameData } from "../hooks/useGameData";

export default function PlayContent() {
  const context = useGameStatusContext();

  const gameData = useGameData();

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

  const { data, status } = gameData;

  if (status === "error") {
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

  if (status === "loading") {
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

  return (
    <PlayingField
      wikiPages={data.wikiPages}
      onBack={() => console.log("back")}
      onMakeGuess={handleMakeGuess}
    />
  );

  // return (
  //   <div
  //     style={{
  //       maxWidth: 900,
  //       margin: "0 auto",
  //       padding: "24px 20px 80px",
  //       color: "var(--text)",
  //     }}
  //   >
  //     <h1
  //       style={{
  //         fontFamily: "var(--font-barlow-condensed), sans-serif",
  //         fontSize: 36,
  //         marginBottom: 24,
  //       }}
  //     >
  //       Play bootstrap
  //     </h1>

  //     <pre
  //       style={{
  //         background: "var(--surface)",
  //         padding: 16,
  //         borderRadius: 8,
  //         fontSize: 13,
  //         overflow: "auto",
  //         marginBottom: 24,
  //       }}
  //     >
  //       {JSON.stringify(
  //         {
  //           ids,
  //           seed,
  //           numPages: numPages,
  //           snippetLength: snippetLength,
  //           lang,
  //           seedParsed: data.parsedSeed,
  //         },
  //         null,
  //         2,
  //       )}
  //     </pre>

  //     {data.wikiPages.map((page) => (
  //       <article
  //         key={page.pageid}
  //         style={{
  //           border: "1px solid var(--border)",
  //           borderRadius: 8,
  //           padding: 16,
  //           marginBottom: 16,
  //         }}
  //       >
  //         <h2 style={{ fontSize: 20, marginBottom: 4 }}>{page.title}</h2>
  //         <p
  //           style={{ fontSize: 13, color: "var(--textdim)", marginBottom: 12 }}
  //         >
  //           id: {page.pageid} ·{" "}
  //           <a href={page.fullurl} target="_blank" rel="noreferrer">
  //             {page.fullurl}
  //           </a>
  //         </p>
  //         <p style={{ lineHeight: 1.6, marginBottom: 12 }}>
  //           <strong>Snippet:</strong> {page.content_censored}
  //         </p>
  //         <details>
  //           <summary style={{ cursor: "pointer", color: "var(--textdim)" }}>
  //             Raw content ({page.content_raw?.length ?? 0} chars)
  //           </summary>
  //           <pre
  //             style={{
  //               marginTop: 12,
  //               fontSize: 12,
  //               whiteSpace: "pre-wrap",
  //               wordBreak: "break-word",
  //               maxHeight: 240,
  //               overflow: "auto",
  //             }}
  //           >
  //             {page.content_raw}
  //           </pre>
  //         </details>
  //       </article>
  //     ))}
  //   </div>
  // );
}
