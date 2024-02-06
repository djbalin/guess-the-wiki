import { WikiDocument } from "@/resources/WikiHelperTypes";
import { useEffect } from "react";

export default function SnippetContent(props: {
  wikiPageObject: WikiDocument;
  dragEnterHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragLeaveHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragDropHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  onClickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  htmlId: string;
}) {
  useEffect(() => {});

  return (
    <p
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={props.dragEnterHandler}
      onDragLeave={props.dragLeaveHandler}
      onDrop={props.dragDropHandler}
      onClick={props.onClickHandler}
      className="wikiSnippet h-full text-xs p-2 lg:p-4 md:text-sm rounded-sm lg:rounded-lg text-left bg-cyan-400"
      id={props.htmlId}
    >
      {props.wikiPageObject.content_censored}
    </p>
  );
}
