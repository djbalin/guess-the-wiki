import { BackgroundColors, WikiDocument } from "@/resources/TypesEnums";
import { useEffect } from "react";

export default function SnippetContent({
  wikiPageObject,
  dragEnterHandler,
  dragLeaveHandler,
  dragDropHandler,
  onClickHandler,
  htmlId,
  showLinks,
}: {
  wikiPageObject: WikiDocument;
  dragEnterHandler: (event: React.DragEvent<HTMLParagraphElement>) => void;
  dragLeaveHandler: (event: React.DragEvent<HTMLParagraphElement>) => void;
  dragDropHandler: (event: React.DragEvent<HTMLParagraphElement>) => void;
  onClickHandler: (event: React.MouseEvent<HTMLParagraphElement>) => void;
  htmlId: string;
  showLinks: boolean;
}) {
  useEffect(() => {});

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
      className="wikiSnippet relative h-full text-sm p-2 lg:p-4 md:text-base rounded-sm lg:rounded-lg text-left"
      id={htmlId}
    >
      <span>{showLinks.toString()}</span>
      {showLinks ? (
        <a
          target="_blank"
          className="absolute bg-slate-800 bg-opacity-80 rounded-lg p-1 top-[-10px] right-[-10px]"
          href={wikiPageObject.url}
        >
          LINK
        </a>
      ) : (
        <></>
      )}
      {wikiPageObject.content_censored}
    </p>
  );
}
