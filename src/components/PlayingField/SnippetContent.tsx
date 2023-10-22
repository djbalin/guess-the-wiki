import { useEffect } from "react";
import { WikiPageObject } from "../../resources/WikiHelperTypes";

function SnippetContent(props: {
  wikiPageObject: WikiPageObject;
  // dragOverHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragEnterHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragLeaveHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragDropHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  onClickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  htmlId: string;
}) {
  useEffect(() => {});

  return (
    <div
      // onDragOver={props.dragOverHandler}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={props.dragEnterHandler}
      onDragLeave={props.dragLeaveHandler}
      onDrop={props.dragDropHandler}
      onClick={props.onClickHandler}
      className="wikiSnippet h-full p-4 text-sm rounded-lg text-left bg-slate-700"
      id={props.htmlId}
    >
      {props.wikiPageObject.content_censored}
      {/* {props.wikiPageObject.id}
      htmlid: + {htmlIdAndContent[0]} */}
    </div>
  );
}

export default SnippetContent;
