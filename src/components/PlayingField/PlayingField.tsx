import SnippetTitle from "./SnippetTitle";
import SnippetContent from "./SnippetContent";

// import {
//   handleDragEnd,
//   handleDragStart,
//   handleDragDrop,
//   handleDragOver,
//   handleDragLeave,
// } from "../../scripts/dragger";
import { useEffect, useRef } from "react";
import { WikiPageObject } from "../../resources/WikiHelperTypes";

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
    // element.classList.remove("hover:cursor-grab:hover");
    element.classList.remove("hover:cursor-grab");
  } else {
    element.setAttribute("draggable", "true");
    // element.classList.add("hover:cursor-grab:hover");
    element.classList.add("hover:cursor-grab");
  }
}

type PlayingFieldProps = {
  wikiPageObjects: WikiPageObject[];
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
    console.log("1ST USEEFFECT RAN)");
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
    console.log("2ND USEEFFECT RAN)");

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

    // toggleGreyedOut(currentlyDragging!);
    dropTarget!.prepend(clonedDragElement);
    // dropTarget!.prepend(currentlyDragging!);
    dropTarget.classList.add("contains_guess");
    // snippetsContainer!.insertBefore(clonedDragElement, dropTarget);
    // currentlyDragging as Node;
    // dropTarget.appendChild(currentlyDragging);

    // dropLocationvalid = true;
    // currentlyDragging = null;

    // // Otherwise, something has already been dropped in the target, and we "reset".

    // dropLocationvalid = false;

    // dropTargetsSaturated.set

    // dropLocationvalid = true;
    currentlyDragging = null;
  };

  const contentHtmlIdsAndPages: Map<string, WikiPageObject> = new Map();

  wikiPageObjects.forEach((wikiPage) => {
    contentHtmlIdsAndPages.set(generateSnippetContentId(), wikiPage);
  });

  const titleHtmlIdsAndPages: Map<string, WikiPageObject> = new Map();

  wikiPageObjects.forEach((wikiPage) => {
    titleHtmlIdsAndPages.set(generateSnippetTitleId(), wikiPage);
  });

  // const wikiPagesAndHtmlIds: Map<
  //   WikiPageObject,
  //   { snippetTitleId: string; snippetContentId: string }
  // > = new Map();

  // wikiPageObjects.forEach((wikiPage) => {
  //   wikiPagesAndHtmlIds.set(wikiPage, {
  //     snippetTitleId: generateSnippetTitleId(),
  //     snippetContentId: generateSnippetContentId(),
  //   });
  // });

  return (
    <div
      id="playingField"
      ref={playingFieldRef}
      className="grid w-auto gap-y-6 mt-16"
    >
      <button className="w-auto" onClick={handleClickMakeGuess}>
        MAKE GUESS!
      </button>
      <div
        ref={titlesRef}
        id="titlesContainer"
        className={
          "grid justify-around place-items-center content-center gap-y-4 gap-x-6"
        }
      >
        {/* {titlesWithIds.map((titleWithId) => (
          <SnippetTitle
            titleWithId={titleWithId}
            dragStartHandler={handleDragStart}
            dragEndHandler={handleDragEnd}
            key={titleWithId.id}
            htmlId={getTitleId()}
          />
        ))} */}
        {Array.from(titleHtmlIdsAndPages.keys()).map((titleHtmlId) => (
          <SnippetTitle
            wikiPage={titleHtmlIdsAndPages.get(titleHtmlId)!}
            dragStartHandler={handleDragStart}
            dragEndHandler={handleDragEnd}
            key={titleHtmlIdsAndPages.get(titleHtmlId)!.title}
            htmlId={titleHtmlId}
          />
        ))}
        {/* {wikiPageObjects.map((wikiPage) => (
          <SnippetTitle
            wikiPage={wikiPage}
            dragStartHandler={handleDragStart}
            dragEndHandler={handleDragEnd}
            key={wikiPagesAndHtmlIds.get(wikiPage)!.snippetTitleId}
            htmlId={generateSnippetTitleId()}
          />
        ))} */}
      </div>

      <div
        ref={snippetsRef}
        id="snippetsContainer"
        className="grid h-min  place-items-center gap-x-6"
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
        {/* {wikiPageObjects.map((wikiPage) => (
          <SnippetContent
            onClickHandler={onClickHandler}
            wikiPageObject={wikiPage}
            // dragOverHandler={handleDragOver}
            dragEnterHandler={handleDragEnter}
            dragLeaveHandler={handleDragLeave}
            dragDropHandler={handleDragDropOnDiv}
            key={wikiPagesAndHtmlIds.get(wikiPage)!.snippetContentId}
            htmlId={generateSnippetContentId()}
          />
        ))} */}
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
// let dropLocationvalid: boolean | null = null;

export const handleDragStart = (
  event: React.DragEvent<HTMLDivElement>
): void => {
  //   event.preventDefault();
  // event.dataTransfer.effectAllowed = "copyMove";
  console.log("drag start");

  const target = event.target as Element;
  currentlyDragging = target;
  toggleGreyedOut(target);
  // target.classList.add("currently_dragging");

  event.dataTransfer.setData("text", event.currentTarget.id);
};

export const handleDragEnd = (event: React.DragEvent<HTMLDivElement>): void => {
  const target = event.target as Element;
  if (event.dataTransfer.dropEffect == "none") {
    toggleGreyedOut(target);
    // target.classList.remove("currently_dragging");
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
