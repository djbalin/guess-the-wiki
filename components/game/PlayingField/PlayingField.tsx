"use client";
import SnippetTitle from "./SnippetTitle";
import SnippetContent from "./SnippetContent";

import { useEffect, useRef, useState } from "react";
import { BackgroundColors, WikiDocument } from "@/resources/TypesEnums";

function toggleGreyedOut(element: Element) {
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

function toggleDraggable(element: Element) {
  if (element.getAttribute("draggable") == "true") {
    element.setAttribute("draggable", "false");
    element.classList.remove("hover:cursor-grab");
  } else {
    element.setAttribute("draggable", "true");
    element.classList.add("hover:cursor-grab");
  }
}

type PlayingFieldProps = {
  wikiPageObjects: WikiDocument[];
  onMakeGuess: (guess: Map<Element, Element | null>) => void;
};

export default function PlayingField({
  wikiPageObjects,
  onMakeGuess,
}: PlayingFieldProps) {
  const titlesWithIds: { title: string; id: number }[] = [];
  for (const wikiPageObject of wikiPageObjects) {
    titlesWithIds.push({ title: wikiPageObject.title, id: wikiPageObject.id });
  }

  const [guessHasBeenMade, setGuessHasBeenMade] = useState<boolean>(false);

  const titlesRef = useRef<HTMLDivElement>(null);
  const snippetsRef = useRef<HTMLDivElement>(null);
  const playingFieldRef = useRef<HTMLDivElement>(null);

  let dropTargets: NodeListOf<Element> | null = null;
  let cloneIdCounter = 0;
  let snippetsSaturatedBy: Map<HTMLElement, HTMLElement | null> = new Map();
  console.log("RENDER PLAYINGFIELD");

  useEffect(() => {
    if (playingFieldRef.current) {
      dropTargets = document.querySelectorAll(".wikiSnippet");
      for (const dropTarget of dropTargets) {
        snippetsSaturatedBy.set(dropTarget as HTMLElement, null);
      }
    }

    const ncols: string = wikiPageObjects.length.toString();
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

  function generateSnippetContentId(): string {
    snippetIdCounter += 1;
    return "s" + snippetIdCounter;
  }
  function generateSnippetTitleId(): string {
    titleIdCounter += 1;
    return "t" + titleIdCounter;
  }

  useEffect(() => {
    const ncols: string = wikiPageObjects.length.toString();
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
    setGuessHasBeenMade(true);
    onMakeGuess(snippetsSaturatedBy);
  }

  function handleClickReset() {
    const titlesContainer = document.getElementById("titlesContainer");
    const snippetsContainer = document.getElementById("snippetsContainer");
    for (const title of titlesContainer!.children) {
      toggleDraggable(title);
      toggleGreyedOut(title);
    }
    for (const snippet of snippetsContainer!.children) {
      snippet.removeChild(snippet.children[0]);
      (snippet as HTMLElement).style.backgroundColor =
        BackgroundColors.UNSATURATED;
    }

    // const saturator = snippetsSaturatedBy.get(clickTarget);
    // if (saturator != null) {
    //   clickTarget.removeChild(clickTarget.children[0]);
    //   toggleDraggable(saturator);
    //   toggleGreyedOut(saturator);
    //   clickTarget.classList.remove("hover:cursor-pointer");
    //   snippetsSaturatedBy.set(clickTarget, null);
    //   toggleCurrentlyDraggingOver(clickTarget);
    // }
    setGuessHasBeenMade(false);
  }

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    let clickTarget = event.target as HTMLElement;
    if (clickTarget.id.startsWith("placed_title_")) {
      clickTarget = clickTarget.parentElement!;
    }
    const saturator = snippetsSaturatedBy.get(clickTarget);
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
    console.log(target.nodeName);
    if (target.nodeName != "LI") {
      if (snippetsSaturatedBy.get(target) == null) {
        toggleCurrentlyDraggingOver(target);
      }
    }
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

    const clonedDragElement: Element = currentlyDragging!.cloneNode(
      true
    ) as Element;

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

  wikiPageObjects.forEach((wikiPage) => {
    contentHtmlIdsAndPages.set(generateSnippetContentId(), wikiPage);
  });

  const titleHtmlIdsAndPages: Map<string, WikiDocument> = new Map();

  wikiPageObjects.forEach((wikiPage) => {
    titleHtmlIdsAndPages.set(generateSnippetTitleId(), wikiPage);
  });

  return (
    <div
      id="playingField"
      ref={playingFieldRef}
      className="flex flex-col bg-amber-500 border-2 rounded-lg p-4"
    >
      <div className="flex flex-row w-full">
        <ul
          ref={titlesRef}
          id="titlesContainer"
          className="flex flex-row w-full items-center justify-around  gap-x-0"
        >
          {Array.from(titleHtmlIdsAndPages.keys()).map((titleHtmlId) => (
            <SnippetTitle
              wikiPage={titleHtmlIdsAndPages.get(titleHtmlId)!}
              dragStartHandler={handleDragStart}
              dragEndHandler={handleDragEnd}
              key={titleHtmlIdsAndPages.get(titleHtmlId)!.title}
              htmlId={titleHtmlId}
            />
          ))}
        </ul>
        {/* <div className="absolute top-0 right-0 w-auto"> */}
        <div className="flex items-center w-auto">
          {guessHasBeenMade ? (
            <button
              className="text-2xl text-nowrap bg-yellow-300 p-2 border-4"
              onClick={handleClickReset}
            >
              RESET!
            </button>
          ) : (
            <button
              className="text-2xl text-nowrap bg-yellow-300 p-2 border-4"
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
          .sort(() => Math.random() - 0.5)
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

let currentlyDragging: HTMLElement | null = null;

export const handleDragStart = (
  event: React.DragEvent<HTMLDivElement>
): void => {
  const target = event.target as HTMLElement;
  currentlyDragging = target;
  toggleGreyedOut(target);
  event.dataTransfer.setData("text", event.currentTarget.id);
};

export const handleDragEnd = (event: React.DragEvent<HTMLDivElement>): void => {
  const target = event.target as Element;
  if (event.dataTransfer.dropEffect == "none") {
    toggleGreyedOut(target);
  }
  currentlyDragging = null;
};

export const handleDragLeave = (
  event: React.DragEvent<HTMLDivElement>
): void => {
  const target = event.target as HTMLElement;
  if (target.nodeName != "LI") {
    if (!target.classList.contains("contains_guess")) {
      toggleCurrentlyDraggingOver(target);
    }
  }
};
