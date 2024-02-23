"use client";
// Inspiration for implementation: https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/
// and: https://www.youtube.com/watch?v=jfYWwQrtzzY
import SnippetTitle from "./SnippetTitle";
import SnippetContent from "./SnippetContent";

import { useEffect, useRef } from "react";
import { BackgroundColors, Result, WikiDocument } from "@/resources/TypesEnums";
import { useGameStatusContext } from "@/contexts/GameStatusContext";
import { JsxElement } from "typescript";
// import GameStatusContext from "@/contexts/GameStatusContext";

function toggleGreyedOut(element: HTMLElement) {
  if (element.classList.contains("greyed_out")) {
    element.classList.remove("greyed_out");
    return;
  }
  element.classList.add("greyed_out");
}

function toggleCurrentlyDraggingOver(elementBeingDraggedOver: HTMLElement) {
  if (elementBeingDraggedOver.classList.contains("emphasized")) {
    elementBeingDraggedOver.classList.remove("emphasized");
    // elementBeingDraggedOver.style.backgroundColor =
    //   BackgroundColors.UNSATURATED;
  } else {
    // elementBeingDraggedOver.style.backgroundColor =
    //   BackgroundColors.CURRENTLY_DRAGGED_OVER;
    elementBeingDraggedOver.classList.add("emphasized");
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

  const playingFieldRef = useRef<HTMLDivElement>(null);
  const titlesContainerRef = useRef<HTMLUListElement>(null);
  const snippetsContainerRef = useRef<HTMLDivElement>(null);

  const currentlySelectedTitleRef = useRef<HTMLLIElement | null>(null);
  const currentlyDragging = useRef<HTMLLIElement | null>(null);

  const cloneIdCounter = useRef(0);
  // let cloneIdCounter = 0;

  // Clear map when new game is launched
  useEffect(() => {
    dropTargetsAndSaturatorsRef.current.clear();
  }, [randomizerArray]);

  const dropTargetsAndSaturatorsRef = useRef(
    new Map<HTMLElement, HTMLElement>()
  );
  // let dropTargetsAndSaturators: Map<HTMLElement, HTMLElement> = new Map();

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

  const contentHtmlIdsAndPages: { [key: string]: WikiDocument } = {};
  const titleHtmlIdsAndPages: { [key: string]: WikiDocument } = {};

  wikiPages.forEach((wikiPage) => {
    contentHtmlIdsAndPages[generateSnippetContentId()] = wikiPage;
    titleHtmlIdsAndPages[generateSnippetTitleId()] = wikiPage;
  });

  const contentHtmlIds: string[] = Object.keys(contentHtmlIdsAndPages);

  const randomizedContentHtmlIds: string[] = randomizerArray.flatMap(
    (rnd) => contentHtmlIds[rnd]
  );

  function handleDragEnd(event: React.DragEvent<HTMLLIElement>): void {
    const target = event.currentTarget;
    if (event.dataTransfer.dropEffect == "none") {
      toggleGreyedOut(target);
    }
    currentlyDragging.current = null;
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

    const titlesContainer = titlesContainerRef.current;
    const snippetsContainer = snippetsContainerRef.current;

    if (titlesContainer && snippetsContainer) {
      titlesContainer.style.gridTemplateColumns = `repeat(${ncols}, minmax(0, 1fr))`;
      snippetsContainer.style.gridTemplateColumns = `repeat(${ncols}, minmax(0, 1fr))`;
    }
  });

  function evaluateSingleGuess(dropTarget: HTMLElement): boolean {
    const saturator = dropTargetsAndSaturatorsRef.current.get(dropTarget);

    const wikiIdOfTitle: number = titleHtmlIdsAndPages[saturator!.id]!.id;
    const wikiIdOfContent: number = contentHtmlIdsAndPages[dropTarget.id].id;
    if (wikiIdOfContent == wikiIdOfTitle) {
      return true;
    } else {
      return false;
    }
  }

  function handleClickMakeGuess(): void {
    const playingFieldObject = playingFieldRef.current!;

    if (dropTargetsAndSaturatorsRef.current.size != wikiPages.length) {
      playingFieldObject.classList.add("shake");
    } else {
      for (const contentContainer of dropTargetsAndSaturatorsRef.current.keys()) {
        // if (dropTargetsAndSaturators.get(contentContainer) == null) {
        //   console.log("NO GUESS MADE");
        // }

        const result: boolean = evaluateSingleGuess(contentContainer);
        // contentContainer.classList.remove("currently_dragging_over");
        if (result == true) {
          // contentContainer.style.backgroundColor = "var(--CORRECT)";
          // contentContainer.classList.add("correctGuess");
          contentContainer.style.backgroundColor = BackgroundColors.CORRECT;
        } else {
          // contentContainer.style.backgroundColor = "var(--INCORRECT)";
          // contentContainer.classList.add("incorrectGuess");
          contentContainer.style.backgroundColor = BackgroundColors.INCORRECT;
        }
      }
      gameStatusContext.setGameStatusContext({
        ...gameStatusContext.gameStatusContext,
        guessHasBeenMade: true,
      });
      onMakeGuess(dropTargetsAndSaturatorsRef.current);
    }
  }

  function handleClickReset() {
    const titlesContainer = titlesContainerRef.current;
    const snippetsContainer = snippetsContainerRef.current;
    if (titlesContainer && snippetsContainer) {
      for (const title of titlesContainer.children) {
        toggleDraggable(title as HTMLElement);
        toggleGreyedOut(title as HTMLElement);
      }
      for (const snippet of snippetsContainer.children) {
        if (snippet) {
          snippet.removeChild(snippet.children[0]);
        }
        // (snippet as HTMLElement).style.backgroundColor =
        //   BackgroundColors.UNSATURATED;
      }
    }
    // dropTargets?.forEach((dropTarget) => {
    //   // dropTargetsAndSaturators.set(dropTarget, null);
    //   dropTarget.classList.remove("contains_guess");
    //   dropTarget.classList.remove("emphasized");
    //   dropTarget.style.backgroundColor = "var(--UNSATURATED)";
    // });

    for (const dropTarget of dropTargetsAndSaturatorsRef.current.keys()) {
      dropTarget.classList.remove("contains_guess");
      dropTarget.classList.remove("emphasized");
      dropTarget.style.backgroundColor = BackgroundColors.UNSATURATED;
    }

    dropTargetsAndSaturatorsRef.current.clear();
    gameStatusContext.setGameStatusContext({
      ...gameStatusContext.gameStatusContext,
      guessHasBeenMade: false,
    });
  }

  function onClickTitle(event: React.MouseEvent<HTMLLIElement>) {
    // console.log(event.currentTarget);
    const clickedTitle = event.currentTarget;
    if (clickedTitle.draggable) {
      if (clickedTitle.classList.contains("selected")) {
        clickedTitle.classList.remove("selected");
        // document.body.style.cursor = "auto";
      } else {
        // currentlyClickedRef.current.classList.add("selected");
        currentlySelectedTitleRef.current?.classList.remove("selected");
        currentlySelectedTitleRef.current = clickedTitle!;
        document.body.style.cursor = "grabbing";

        currentlySelectedTitleRef.current.classList.add("selected");
        // document.body.style.cursor = "grabbing";
      }
    }

    // event.currentTarget.classList.add("selected");
    // currentlyDragging = clickedTitle;
    // cur;
  }

  const onClickContent = (event: React.MouseEvent<HTMLDivElement>): void => {
    let clickedContent = event.target as HTMLElement;
    if (clickedContent.id.startsWith("placed_title_")) {
      clickedContent = clickedContent.parentElement!;
    }
    if (!gameStatusContext.gameStatusContext.guessHasBeenMade) {
      const saturator = dropTargetsAndSaturatorsRef.current.get(clickedContent);
      if (saturator != null) {
        clickedContent.removeChild(clickedContent.children[0]);
        toggleDraggable(saturator);
        toggleGreyedOut(saturator);
        clickedContent.classList.remove("hover:cursor-pointer");
        clickedContent.style.backgroundColor = BackgroundColors.UNSATURATED;
        dropTargetsAndSaturatorsRef.current.delete(clickedContent);
        toggleCurrentlyDraggingOver(clickedContent);
      }

      const currentlySelectedTitle = currentlySelectedTitleRef.current;
      if (currentlySelectedTitle != null) {
        // Make a copy of the title
        const clonedSelectedTitle: HTMLElement =
          currentlySelectedTitle.cloneNode(true) as HTMLLIElement;
        clonedSelectedTitle.classList.remove("selected");
        clonedSelectedTitle.id =
          "placed_title_" + (cloneIdCounter.current++).toString();
        clonedSelectedTitle.classList.remove("hover:cursor-move");
        clonedSelectedTitle.classList.add("hover:cursor-pointer");
        clonedSelectedTitle.setAttribute("draggable", "false");

        dropTargetsAndSaturatorsRef.current.set(
          clickedContent,
          currentlySelectedTitle
        );

        clickedContent.prepend(clonedSelectedTitle);
        clickedContent.classList.add("contains_guess", "emphasized");
        clickedContent.style.backgroundColor = BackgroundColors.EMPHASIZED;
        currentlySelectedTitle.classList.remove("selected");
        toggleDraggable(currentlySelectedTitle);
        toggleGreyedOut(currentlySelectedTitle);
        currentlySelectedTitleRef.current = null;
        document.body.style.cursor = "auto";
      }
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.nodeName != "LI") {
      if (dropTargetsAndSaturatorsRef.current.get(target) == null) {
        toggleCurrentlyDraggingOver(target);
      }
    }
  };
  const handleDragStart = (event: React.DragEvent<HTMLLIElement>): void => {
    const dragging = event.currentTarget;
    currentlyDragging.current = dragging;
    toggleGreyedOut(dragging);
    event.dataTransfer.setData("text", event.currentTarget.id);
    if (playingFieldRef.current?.classList.contains("shake")) {
      playingFieldRef.current.classList.remove("shake");
    }
  };

  const handleDragDropOnDiv = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    let dropTarget: HTMLDivElement | HTMLParagraphElement = event.currentTarget;
    if (dropTarget.classList.contains("wikiTitle") == true) {
      dropTarget = dropTarget.parentElement as HTMLParagraphElement;
    }
    const previousGuess = dropTargetsAndSaturatorsRef.current.get(dropTarget);
    if (previousGuess != null) {
      toggleGreyedOut(previousGuess);
      toggleDraggable(previousGuess);
      dropTarget.removeChild(dropTarget.children[0]);
    }
    // dropTarget.classList.add("hover:cursor-pointer");

    dropTargetsAndSaturatorsRef.current.set(
      dropTarget,
      currentlyDragging.current!
    );
    toggleDraggable(currentlyDragging.current!);

    const clonedDragElement: HTMLElement = currentlyDragging.current!.cloneNode(
      true
    ) as HTMLLIElement;

    clonedDragElement.id =
      "placed_title_" + (cloneIdCounter.current++).toString();
    clonedDragElement.classList.remove("hover:cursor-move");
    clonedDragElement.classList.add("hover:cursor-pointer");
    // clonedDragElement.setAttribute("draggable", "true");
    toggleGreyedOut(clonedDragElement);

    dropTarget.prepend(clonedDragElement);
    dropTarget.classList.add("contains_guess");
    dropTarget.classList.add("emphasized");
    dropTarget.style.backgroundColor = BackgroundColors.EMPHASIZED;

    currentlyDragging.current = null;
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
          ref={titlesContainerRef}
          className="flex flex-row w-full gap-x-6 items-center justify-evenly pr-4"
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
                  clickTitleHandler={onClickTitle}
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
        ref={snippetsContainerRef}
        className="grid h-min pt-6 place-items-center gap-x-6"
      >
        {randomizedContentHtmlIds.map((htmlId: string) => {
          const wikiPage: WikiDocument = contentHtmlIdsAndPages[htmlId];

          return (
            <SnippetContent
              onClickContentHandler={onClickContent}
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
