import { WikiDocument } from "@/resources/TypesEnums";
import { useEffect } from "react";

interface SnippetTitleProps {
  wikiPage: WikiDocument;
  dragStartHandler: (event: React.DragEvent<HTMLLIElement>) => void;
  dragEndHandler: (event: React.DragEvent<HTMLLIElement>) => void;
  clickTitleHandler: (event: React.MouseEvent<HTMLLIElement>) => void;
  htmlId: string;
}

function SnippetTitle(props: SnippetTitleProps) {
  // useEffect(() => {
  //   const el: HTMLElement | null = document.getElementById(props.htmlId);
  //   const length = props.wikiPage.title.length;
  //   // if (length > 40) {
  //   //   el!.style.fontSize = "0.75rem";
  //   //   el!.style.lineHeight = "1rem";
  //   // } else {
  //   //   el!.style.fontSize = "0.875rem";
  //   //   el!.style.lineHeight = "1.25rem";
  //   // }
  // });

  return (
    <li
      onDragStart={(e) => props.dragStartHandler(e)}
      onDragEnd={(e) => props.dragEndHandler(e)}
      onClick={props.clickTitleHandler}
      draggable="true"
      className="wikiTitle flex justify-center text-center list-none font-semibold xl:w-auto text-lg bg-blue-500 leading-6  rounded-[1rem] lg:rounded-xl py-2 px-4 items-center hover:cursor-move"
      id={props.htmlId}
    >
      {props.wikiPage.title}
    </li>
  );
}

export default SnippetTitle;
