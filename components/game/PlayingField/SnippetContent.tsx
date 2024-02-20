import { useGameStatusContext } from "@/contexts/GameStatusContext";
import { BackgroundColors, WikiDocument } from "@/resources/TypesEnums";
import { useEffect } from "react";
import { FaExternalLinkAlt, FaExternalLinkSquareAlt } from "react-icons/fa";

export default function SnippetContent({
  wikiPageObject,
  dragEnterHandler,
  dragLeaveHandler,
  dragDropHandler,
  onClickHandler,
  htmlId,
}: {
  wikiPageObject: WikiDocument;
  dragEnterHandler: (event: React.DragEvent<HTMLParagraphElement>) => void;
  dragLeaveHandler: (event: React.DragEvent<HTMLParagraphElement>) => void;
  dragDropHandler: (event: React.DragEvent<HTMLParagraphElement>) => void;
  onClickHandler: (event: React.MouseEvent<HTMLParagraphElement>) => void;
  htmlId: string;
}) {
  const context = useGameStatusContext();
  return (
    <p
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dragDropHandler}
      onClick={onClickHandler}
      style={{ backgroundColor: BackgroundColors.UNSATURATED }}
      className="wikiSnippet p-2 text-sm  md:text-base  text-left lg:p-4 relative h-full rounded-sm lg:rounded-lg"
      id={htmlId}
    >
      {context.gameStatusContext.revealSolution ? (
        <>
          <a target="_blank" href={wikiPageObject.url}>
            <span className="text-base break-normal w-full text-center inline-flex p-2 items-center bg-green-500 justify-center text-black font-bold rounded-xl my-1 ">
              {/* <span></span> */}

              {wikiPageObject.title}
              <span className="flex items-center justify-center w-6 h-6">
                <FaExternalLinkAlt></FaExternalLinkAlt>
              </span>
            </span>
          </a>
          <br></br>
        </>
      ) : (
        <></>
      )}
      {wikiPageObject.content_censored}
    </p>
  );
}
