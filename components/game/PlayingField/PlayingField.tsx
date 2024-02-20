"use client";
import SnippetTitle from "./SnippetTitle";
import SnippetContent from "./SnippetContent";

import { useContext, useEffect, useRef, useState } from "react";
import { BackgroundColors, WikiDocument } from "@/resources/TypesEnums";
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

// type PlayingFieldProps = {
//   wikiPageObjects: WikiDocument[];
//   onMakeGuess: (guess: Map<HTMLElement, HTMLElement | null>) => void;
// };

export default function PlayingField({
  wikiPages,
  onMakeGuess,
}: {
  wikiPages: WikiDocument[];
  onMakeGuess: (guess: Map<HTMLElement, HTMLElement>) => void;
}) {
  // PlayingFieldProps)
  // const titlesWithIds: { title: string; id: number }[] = [];
  // for (const wikiPageObject of wikiPages) {
  //   titlesWithIds.push({ title: wikiPageObject.title, id: wikiPageObject.id });
  // }

  // const context = useContext(GameStatusContext);
  // console.log("CONTEXT: " + context.hidden + " " + context.retry);

  const context = useGameStatusContext();

  const [randomizer, setRandomizer] = useState<number>(0);
  // const [guessHasBeenMade, setGuessHasBeenMade] = useState<boolean>(false);

  const titlesRef = useRef<HTMLUListElement | null>(null);
  const snippetsRef = useRef<HTMLDivElement | null>(null);
  const playingFieldRef = useRef<HTMLDivElement | null>(null);

  let dropTargets: NodeListOf<HTMLElement> | null = null;
  let cloneIdCounter = 0;
  let snippetsSaturatedBy: Map<HTMLElement, HTMLElement | null> = new Map();

  useEffect(() => {
    setRandomizer(Math.random());
    if (playingFieldRef.current) {
      dropTargets = document.querySelectorAll(".wikiSnippet");
      for (const dropTarget of dropTargets) {
        snippetsSaturatedBy.set(dropTarget as HTMLElement, null);
      }
    }

    const ncols: string = wikiPages.length.toString();
    const titlesContainer: HTMLElement | null =
      document.getElementById("titlesContainer");
    const snippetsContainer: HTMLElement | null =
      document.getElementById("snippetsContainer");

    if (titlesContainer && snippetsContainer) {
      titlesContainer.style.gridTemplateColumns = `repeat(${ncols}, minmax(0, 1fr))`;
      snippetsContainer.style.gridTemplateColumns = `repeat(${ncols}, minmax(0, 1fr))`;
    }
  }, []);

  let titleIdCounter = 0;
  let snippetIdCounter = 0;

  let currentlyDragging: HTMLElement | null = null;

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

  function generateSnippetContentId(): string {
    snippetIdCounter += 1;
    return "s" + snippetIdCounter;
  }
  function generateSnippetTitleId(): string {
    titleIdCounter += 1;
    return "t" + titleIdCounter;
  }

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
    const saturator = snippetsSaturatedBy.get(dropTarget);

    const wikiIdOfTitle: number = titleHtmlIdsAndPages.get(saturator!.id)!.id;
    const wikiIdOfContent: number = contentHtmlIdsAndPages.get(
      dropTarget.id
    )!.id;
    if (wikiIdOfContent == wikiIdOfTitle) {
      return true;
    } else {
      return false;
    }
  }

  function handleClickMakeGuess(): void {
    for (const ssb of snippetsSaturatedBy.keys()) {
      const result: boolean = evaluateSingleGuess(ssb);
      ssb.classList.remove("currently_dragging_over");
      if (result == true) {
        ssb.style.backgroundColor = BackgroundColors.CORRECT;
      } else {
        ssb.style.backgroundColor = BackgroundColors.INCORRECT;
      }
    }
    //
    // TODO
    // TODO
    // TODO
    //
    // setGuessHasBeenMade(true);
    context.setGameStatusContext({
      ...context.gameStatusContext,
      guessHasBeenMade: true,
    });
    onMakeGuess(snippetsSaturatedBy);
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
      snippetsSaturatedBy.set(dropTarget, null);
      dropTarget.classList.remove("contains_guess");
    });

    // const saturator = snippetsSaturatedBy.get(clickTarget);
    // if (saturator != null) {
    //   clickTarget.removeChild(clickTarget.children[0]);
    //   toggleDraggable(saturator);
    //   toggleGreyedOut(saturator);
    //   clickTarget.classList.remove("hover:cursor-pointer");
    //   snippetsSaturatedBy.set(clickTarget, null);
    //   toggleCurrentlyDraggingOver(clickTarget);
    // }
    // setGuessHasBeenMade(false);
    context.setGameStatusContext({
      ...context.gameStatusContext,
      guessHasBeenMade: false,
    });
    // console.log(guessHasBeenMade);
  }

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    let clickTarget = event.target as HTMLElement;
    if (clickTarget.id.startsWith("placed_title_")) {
      clickTarget = clickTarget.parentElement!;
    }
    const saturator = snippetsSaturatedBy.get(clickTarget);
    // console.log(saturator);

    if (saturator != null) {
      clickTarget.removeChild(clickTarget.children[0]);
      toggleDraggable(saturator);
      toggleGreyedOut(saturator);
      clickTarget.classList.remove("hover:cursor-pointer");
      snippetsSaturatedBy.set(clickTarget, null);

      toggleCurrentlyDraggingOver(clickTarget);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.nodeName != "LI") {
      if (snippetsSaturatedBy.get(target) == null) {
        toggleCurrentlyDraggingOver(target);
      }
    }
  };
  const handleDragStart = (event: React.DragEvent<HTMLLIElement>): void => {
    const target = event.target as HTMLElement;
    currentlyDragging = target;
    toggleGreyedOut(target);
    event.dataTransfer.setData("text", event.currentTarget.id);
  };

  const handleDragDropOnDiv = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    let dropTarget = event.target as HTMLElement;
    if (dropTarget.classList.contains("wikiTitle") == true) {
      dropTarget = dropTarget.parentElement as HTMLElement;
    }
    const previousGuess = snippetsSaturatedBy.get(dropTarget);
    if (previousGuess != null) {
      toggleGreyedOut(previousGuess);
      toggleDraggable(previousGuess);
      dropTarget.removeChild(dropTarget.children[0]);
    }
    dropTarget.classList.add("hover:cursor-pointer");
    snippetsSaturatedBy.set(dropTarget, currentlyDragging);
    toggleDraggable(currentlyDragging!);

    const clonedDragElement: HTMLElement = currentlyDragging!.cloneNode(
      true
    ) as HTMLElement;

    clonedDragElement.id = "placed_title_" + (++cloneIdCounter).toString();
    clonedDragElement.classList.remove("hover:cursor-move");
    clonedDragElement.classList.add("hover:cursor-pointer");
    clonedDragElement.setAttribute("draggable", "true");
    toggleGreyedOut(clonedDragElement);

    dropTarget.prepend(clonedDragElement);
    dropTarget.classList.add("contains_guess");

    currentlyDragging = null;
  };

  const contentHtmlIdsAndPages: Map<string, WikiDocument> = new Map();

  wikiPages.forEach((wikiPage) => {
    contentHtmlIdsAndPages.set(generateSnippetContentId(), wikiPage);
  });

  const titleHtmlIdsAndPages: Map<string, WikiDocument> = new Map();

  wikiPages.forEach((wikiPage) => {
    titleHtmlIdsAndPages.set(generateSnippetTitleId(), wikiPage);
  });

  return (
    <div
      id="playingField"
      ref={playingFieldRef}
      className="flex flex-col bg-amber-500 border-2 rounded-lg p-6"
    >
      <span>
        GAME STATUS CONTEXT: show playing field ?{" "}
        {context.gameStatusContext.showPlayingField.toString()} guess has been
        made ? {context.gameStatusContext.guessHasBeenMade.toString()}
      </span>
      <div className="flex flex-row w-full">
        <ul
          ref={titlesRef}
          id="titlesContainer"
          className="flex flex-row w-full items-center justify-between pr-4"
        >
          {Array.from(titleHtmlIdsAndPages.keys()).map((titleHtmlId) => (
            <SnippetTitle
              wikiPage={titleHtmlIdsAndPages.get(titleHtmlId)!}
              dragStartHandler={(e) => {
                handleDragStart(e);
              }}
              dragEndHandler={handleDragEnd}
              key={titleHtmlIdsAndPages.get(titleHtmlId)!.title}
              htmlId={titleHtmlId}
            />
          ))}
        </ul>
        <div className="flex items-center w-auto">
          {context.gameStatusContext.guessHasBeenMade ? (
            <button
              className="text-2xl text-nowrap bg-yellow-300 p-2 border-4"
              onClick={handleClickReset}
            >
              RETRY!
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
        ref={snippetsRef}
        id="snippetsContainer"
        className="grid h-min pt-6 place-items-center gap-x-6"
      >
        {Array.from(contentHtmlIdsAndPages.keys())
          .sort(() => randomizer - 0.5)
          .map((contentHtmlId) => (
            <SnippetContent
              onClickHandler={onClickHandler}
              wikiPageObject={contentHtmlIdsAndPages.get(contentHtmlId)!}
              // dragOverHandler={handleDragOver}
              dragEnterHandler={handleDragEnter}
              dragLeaveHandler={handleDragLeave}
              dragDropHandler={handleDragDropOnDiv}
              key={contentHtmlIdsAndPages.get(contentHtmlId)!.id}
              htmlId={contentHtmlId}
            />
          ))}
      </div>
    </div>
  );
}

// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// ///////////
// Inspiration for implementation: https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/
// and: https://www.youtube.com/watch?v=jfYWwQrtzzY
