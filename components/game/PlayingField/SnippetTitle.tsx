import { WikiDocument } from "@/resources/TypesEnums";
import { useEffect } from "react";

interface SnippetTitleProps {
  wikiPage: WikiDocument;
  dragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragEndHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  htmlId: string;
}

function SnippetTitle(props: SnippetTitleProps) {
  useEffect(() => {
    const el: HTMLElement | null = document.getElementById(props.htmlId);
    const length = props.wikiPage.title.length;
    // if (length > 40) {
    //   el!.style.fontSize = "0.75rem";
    //   el!.style.lineHeight = "1rem";
    // } else {
    //   el!.style.fontSize = "0.875rem";
    //   el!.style.lineHeight = "1.25rem";
    // }
  });

  return (
    <li
      onDragStart={props.dragStartHandler}
      onDragEnd={props.dragEndHandler}
      draggable="true"
      className="wikiTitle font-semibold w-auto text-base bg-blue-500  rounded-[1rem] lg:rounded-[2rem] p-2 lg:p-4 items-center justify-center hover:cursor-move"
      id={props.htmlId}
    >
      {props.wikiPage.title}
    </li>
  );
}

export default SnippetTitle;
