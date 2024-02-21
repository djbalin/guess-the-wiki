"use client";
// Inspiration for implementation: https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/
// and: https://www.youtube.com/watch?v=jfYWwQrtzzY
import SnippetTitle from "./SnippetTitle";
import SnippetContent from "./SnippetContent";

import { useEffect, useRef } from "react";
import { BackgroundColors, Result, WikiDocument } from "@/resources/TypesEnums";
import { useGameStatusContext } from "@/contexts/GameStatusContext";
// import GameStatusContext from "@/contexts/GameStatusContext";

function toggleGreyedOut(element: HTMLElement) {
  if (element.classList.contains("greyed_out")) {
    element.classList.remove("greyed_out");
    return;
  }
  element.classList.add("greyed_out");
}

function toggleCurrentlyDraggingOver(elementBeingDraggedOver: HTMLElement) {
  if (elementBeingDraggedOver.classList.contains("currently_dragging_over")) {
    elementBeingDraggedOver.classList.remove("currently_dragging_over");
    elementBeingDraggedOver.style.backgroundColor =
      BackgroundColors.UNSATURATED;
  } else {
    elementBeingDraggedOver.style.backgroundColor =
      BackgroundColors.CURRENTLY_DRAGGED_OVER;
    elementBeingDraggedOver.classList.add("currently_dragging_over");
  }
}

function toggleDraggable(element: HTMLElement) {
  if (element.getAttribute("draggable") == "true") {
    element.setAttribute("draggable", "false");
    element.classList.remove("hover:cursor-grab");
  } else {
    element.setAttribute("draggable", "true");
    element.classList.add("hover:cursor-grab");
  }
}

export default function PlayingField({
  wikiPages,
  onMakeGuess,
  randomizerArray,
}: {
  wikiPages: WikiDocument[];
  onMakeGuess: (guess: Map<HTMLElement, HTMLElement>) => void;
  randomizerArray: number[];
}) {
  const gameStatusContext = useGameStatusContext();
  console.log("Playingfield, randomizer is: " + randomizerArray);

  const playingFieldRef = useRef<HTMLDivElement | null>(null);

  let dropTargets: NodeListOf<HTMLElement> | null = null;
  const cloneIdCounter = useRef(0);
  // let cloneIdCounter = 0;
  let dropTargetsAndSaturators: Map<HTMLElement, HTMLElement> = new Map();

  let titleIdCounter = 0;
  let snippetIdCounter = 0;
  function generateSnippetContentId(): string {
    snippetIdCounter += 1;
    return "s" + snippetIdCounter;
  }
  function generateSnippetTitleId(): string {
    titleIdCounter += 1;
    return "t" + titleIdCounter;
  }

  let currentlyDragging: HTMLElement | null = null;

  const contentHtmlIdsAndPages: { [key: string]: WikiDocument } = {};
  const titleHtmlIdsAndPages: { [key: string]: WikiDocument } = {};

  wikiPages.forEach((wikiPage) => {
    contentHtmlIdsAndPages[generateSnippetContentId()] = wikiPage;
    titleHtmlIdsAndPages[generateSnippetTitleId()] = wikiPage;
  });

  console.log(contentHtmlIdsAndPages);
  console.log(titleHtmlIdsAndPages);

  const contentHtmlIds: string[] = Object.keys(contentHtmlIdsAndPages);
  console.log("contentHtmlIds: " + contentHtmlIds);

  const randomizedContentHtmlIds: string[] = randomizerArray.flatMap(
    (rnd) => contentHtmlIds[rnd]
  );
  console.log("randomized contenthtmlids: " + randomizedContentHtmlIds);

  function handleDragEnd(event: React.DragEvent<HTMLLIElement>): void {
    const target = event.target as HTMLElement;
    if (event.dataTransfer.dropEffect == "none") {
      toggleGreyedOut(target);
    }
    currentlyDragging = null;
  }

  const handleDragLeave = (
    event: React.DragEvent<HTMLParagraphElement>
  ): void => {
    const target = event.target as HTMLElement;
    if (target.nodeName != "LI") {
      if (!target.classList.contains("contains_guess")) {
        toggleCurrentlyDraggingOver(target);
      }
    }
  };

  useEffect(() => {
    const ncols: string = wikiPages.length.toString();
    const titlesContainer: HTMLElement | null =
      document.getElementById("titlesContainer");
    const snippetsContainer: HTMLElement | null =
      document.getElementById("snippetsContainer");

    if (titlesContainer && snippetsContainer) {
      titlesContainer.style.gridTemplateColumns = `repeat(${ncols}, minmax(0, 1fr))`;
      snippetsContainer.style.gridTemplateColumns = `repeat(${ncols}, minmax(0, 1fr))`;
    }
  });

  function evaluateSingleGuess(dropTarget: HTMLElement): boolean {
    const saturator = dropTargetsAndSaturators.get(dropTarget);

    const wikiIdOfTitle: number = titleHtmlIdsAndPages[saturator!.id]!.id;
    const wikiIdOfContent: number = contentHtmlIdsAndPages[dropTarget.id].id;
    if (wikiIdOfContent == wikiIdOfTitle) {
      return true;
    } else {
      return false;
    }
  }

  function handleClickMakeGuess(): void {
    console.log("Handling click make guesss");
    console.log("droptargetandsats size: " + dropTargetsAndSaturators.size);
    const playingFieldObject = playingFieldRef.current!;

    if (dropTargetsAndSaturators.size != wikiPages.length) {
      console.log(
        "HEY! You need to make a guess for each title!" +
          playingFieldObject.classList
      );
      playingFieldObject.classList.add("shake");
    } else {
      for (const ssb of dropTargetsAndSaturators.keys()) {
        console.log(ssb);
        if (dropTargetsAndSaturators.get(ssb) == null) {
          console.log("NO GUESS MADE");
        }

        const result: boolean = evaluateSingleGuess(ssb);
        ssb.classList.remove("currently_dragging_over");
        if (result == true) {
          ssb.style.backgroundColor = BackgroundColors.CORRECT;
        } else {
          ssb.style.backgroundColor = BackgroundColors.INCORRECT;
        }
      }
      gameStatusContext.setGameStatusContext({
        ...gameStatusContext.gameStatusContext,
        guessHasBeenMade: true,
      });
      onMakeGuess(dropTargetsAndSaturators as Map<HTMLElement, HTMLElement>);
    }
  }

  function handleClickReset() {
    const titlesContainer = document.getElementById("titlesContainer");
    const snippetsContainer = document.getElementById("snippetsContainer");
    for (const title of titlesContainer!.children) {
      toggleDraggable(title as HTMLElement);
      toggleGreyedOut(title as HTMLElement);
    }
    for (const snippet of snippetsContainer!.children) {
      snippet.removeChild(snippet.children[0]);
      (snippet as HTMLElement).style.backgroundColor =
        BackgroundColors.UNSATURATED;
    }
    dropTargets?.forEach((dropTarget) => {
      dropTargetsAndSaturators.clear();
      // dropTargetsAndSaturators.set(dropTarget, null);
      dropTarget.classList.remove("contains_guess");
    });

    gameStatusContext.setGameStatusContext({
      ...gameStatusContext.gameStatusContext,
      guessHasBeenMade: false,
    });
  }

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    let clickTarget = event.target as HTMLElement;
    if (clickTarget.id.startsWith("placed_title_")) {
      clickTarget = clickTarget.parentElement!;
    }
    const saturator = dropTargetsAndSaturators.get(clickTarget);
    if (saturator != null) {
      clickTarget.removeChild(clickTarget.children[0]);
      toggleDraggable(saturator);
      toggleGreyedOut(saturator);
      clickTarget.classList.remove("hover:cursor-pointer");
      // dropTargetsAndSaturators.set(clickTarget, null);
      dropTargetsAndSaturators.delete(clickTarget);
      toggleCurrentlyDraggingOver(clickTarget);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.nodeName != "LI") {
      if (dropTargetsAndSaturators.get(target) == null) {
        toggleCurrentlyDraggingOver(target);
      }
    }
  };
  const handleDragStart = (event: React.DragEvent<HTMLLIElement>): void => {
    const target = event.target as HTMLElement;
    currentlyDragging = target;
    toggleGreyedOut(target);
    event.dataTransfer.setData("text", event.currentTarget.id);
    if (playingFieldRef.current?.classList.contains("shake")) {
      playingFieldRef.current.classList.remove("shake");
    }
  };

  const handleDragDropOnDiv = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    let dropTarget = event.target as HTMLElement;
    if (dropTarget.classList.contains("wikiTitle") == true) {
      dropTarget = dropTarget.parentElement as HTMLElement;
    }
    const previousGuess = dropTargetsAndSaturators.get(dropTarget);
    if (previousGuess != null) {
      toggleGreyedOut(previousGuess);
      toggleDraggable(previousGuess);
      dropTarget.removeChild(dropTarget.children[0]);
    }
    dropTarget.classList.add("hover:cursor-pointer");
    dropTargetsAndSaturators.set(dropTarget, currentlyDragging!);
    toggleDraggable(currentlyDragging!);

    const clonedDragElement: HTMLElement = currentlyDragging!.cloneNode(
      true
    ) as HTMLElement;

    clonedDragElement.id =
      "placed_title_" + (cloneIdCounter.current++).toString();
    clonedDragElement.classList.remove("hover:cursor-move");
    clonedDragElement.classList.add("hover:cursor-pointer");
    clonedDragElement.setAttribute("draggable", "true");
    toggleGreyedOut(clonedDragElement);

    dropTarget.prepend(clonedDragElement);
    dropTarget.classList.add("contains_guess");

    currentlyDragging = null;
  };

  return (
    <div
      id="playingField"
      ref={playingFieldRef}
      className="flex flex-col bg-amber-500 border-2 rounded-lg p-6"
    >
      <div className="flex flex-row w-full">
        <ul
          id="titlesContainer"
          className="flex flex-row w-full gap-x-6 items-center justify-between pr-4"
        >
          {Array.from(
            Object.entries(titleHtmlIdsAndPages).map((titleHtmlIdAndPage) => {
              const [htmlId, page] = titleHtmlIdAndPage;
              return (
                <SnippetTitle
                  wikiPage={page}
                  dragStartHandler={(e) => {
                    handleDragStart(e);
                  }}
                  dragEndHandler={handleDragEnd}
                  key={page.id}
                  htmlId={htmlId}
                />
              );
            })
          )}
        </ul>
        <div className="flex items-center w-auto">
          {gameStatusContext.gameStatusContext.guessHasBeenMade ? (
            <button
              disabled={gameStatusContext.gameStatusContext.result == 1}
              className="text-2xl text-nowrap bg-yellow-300 p-2 border-4 disabled:hover:cursor-not-allowed"
              onClick={handleClickReset}
            >
              {gameStatusContext.gameStatusContext.result == 1
                ? "BRAVO!"
                : "TRY AGAIN!"}
            </button>
          ) : (
            <button
              className="right-0 text-2xl text-nowrap bg-yellow-300 p-2 border-4"
              onClick={handleClickMakeGuess}
            >
              MAKE GUESS!
            </button>
          )}
        </div>
      </div>

      <div
        id="snippetsContainer"
        className="grid h-min pt-6 place-items-center gap-x-6"
      >
        {randomizedContentHtmlIds.map((htmlId: string) => {
          const wikiPage: WikiDocument = contentHtmlIdsAndPages[htmlId];

          return (
            <SnippetContent
              onClickHandler={onClickHandler}
              wikiPageObject={wikiPage}
              // dragOverHandler={handleDragOver}
              dragEnterHandler={handleDragEnter}
              dragLeaveHandler={handleDragLeave}
              dragDropHandler={handleDragDropOnDiv}
              key={wikiPage.id}
              htmlId={htmlId}
            />
          );
        })}
      </div>
      <div className="w-full flex items-end mt-4 justify-end">
        <button
          className="right-0 text-xl text-nowrap bg-yellow-300 p-2 border-4"
          onClick={(e) =>
            gameStatusContext.setGameStatusContext({
              ...gameStatusContext.gameStatusContext,
              revealSolution:
                !gameStatusContext.gameStatusContext.revealSolution,
            })
          }
        >
          {gameStatusContext.gameStatusContext.revealSolution
            ? "Hide solution"
            : "Reveal solution"}
        </button>
      </div>
    </div>
  );
}
