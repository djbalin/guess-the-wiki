import SnippetTitle from "./SnippetTitle";
import SnippetContent from "./SnippetContent";

import { useEffect, useRef } from "react";
import { WikiDocument } from "@/resources/WikiHelperTypes";

function toggleGreyedOut(element: Element) {
  if (element.classList.contains("greyed_out")) {
    element.classList.remove("greyed_out");
    return;
  }
  element.classList.add("greyed_out");
}

function toggleCurrentlyDraggingOver(elementBeingDraggedOver: Element) {
  elementBeingDraggedOver.classList.contains("currently_dragging_over")
    ? elementBeingDraggedOver.classList.remove("currently_dragging_over")
    : elementBeingDraggedOver.classList.add("currently_dragging_over");
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

export function PlayingField({
  wikiPageObjects,
  onMakeGuess,
}: PlayingFieldProps) {
  const titlesWithIds: { title: string; id: number }[] = [];
  for (const wikiPageObject of wikiPageObjects) {
    titlesWithIds.push({ title: wikiPageObject.title, id: wikiPageObject.id });
  }

  const titlesRef = useRef<HTMLDivElement>(null);
  const snippetsRef = useRef<HTMLDivElement>(null);
  const playingFieldRef = useRef<HTMLDivElement>(null);

  let dropTargets: NodeListOf<Element> | null = null;
  let cloneIdCounter = 0;
  let snippetsSaturatedBy: Map<Element, Element | null> = new Map();

  useEffect(() => {
    if (playingFieldRef.current) {
      dropTargets = document.querySelectorAll(".wikiSnippet");
      for (const dropTarget of dropTargets) {
        snippetsSaturatedBy.set(dropTarget, null);
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

  function evaluateSingleGuess(dropTarget: Element): boolean {
    const saturator: Element = snippetsSaturatedBy.get(dropTarget) as Element;

    const wikiIdOfTitle: number = titleHtmlIdsAndPages.get(saturator.id)!.id;
    const wikiIdOfContent: number = contentHtmlIdsAndPages.get(
      dropTarget.id
    )!.id;
    if (wikiIdOfContent == wikiIdOfTitle) {
      return true;
    } else {
      return false;
    }
  }

  const handleClickMakeGuess = (): void => {
    for (const ssb of snippetsSaturatedBy.keys()) {
      const result: boolean = evaluateSingleGuess(ssb);
      ssb.classList.remove("currently_dragging_over");
      ssb.classList.remove("bg-slate-700");
      if (result == true) {
        ssb.classList.add("bg-green-600");
      } else {
        ssb.classList.add("bg-red-700");
      }
    }
    //
    // TODO
    // TODO
    // TODO
    //
    onMakeGuess(snippetsSaturatedBy);
  };

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    let clickTarget: Element = event.target as Element;
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
    const target = event.target as Element;
    if (snippetsSaturatedBy.get(target) == null) {
      toggleCurrentlyDraggingOver(target);
    }
  };

  const handleDragDropOnDiv = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    let dropTarget = event.target as Element;
    if (dropTarget.classList.contains("wikiTitle") == true) {
      dropTarget = dropTarget.parentElement as Element;
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
          <button
            className="text-2xl text-nowrap bg-yellow-300 p-2 border-4"
            onClick={handleClickMakeGuess}
          >
            MAKE GUESS!
          </button>
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

let currentlyDragging: Element | null = null;

export const handleDragStart = (
  event: React.DragEvent<HTMLDivElement>
): void => {
  const target = event.target as Element;
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
  const target = event.target as Element;
  if (!target.classList.contains("contains_guess")) {
    toggleCurrentlyDraggingOver(target);
  }
};

export default PlayingField;
