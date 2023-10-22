import { useEffect } from "react";
import { WikiPageObject } from "../../resources/WikiHelperTypes";

interface SnippetTitleProps {
  // titleWithId: { title: string; id: number };

  wikiPage: WikiPageObject;
  dragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  dragEndHandler: (event: React.DragEvent<HTMLDivElement>) => void;
  htmlId: string;
}

function SnippetTitle(props: SnippetTitleProps) {
  // const textsize = props.titleWithId.title.length > 40 ? "xs" : "sm";

  useEffect(() => {
    console.log("Useeffect snipepttitel ran");

    const el: HTMLElement | null = document.getElementById(props.htmlId);
    const length = props.wikiPage.title.length;
    // font-size: 0.75rem/* 12px */;
    // line-height: 1rem/* 16px */;
    if (length > 40) {
      el!.style.fontSize = "0.75rem";
      el!.style.lineHeight = "1rem";
    } else {
      el!.style.fontSize = "0.875rem";
      el!.style.lineHeight = "1.25rem";
    }
    // if (el) {
    //   el.style.fontSize =  > 10 ? "xs" : "sm";
    // }
  });

  return (
    <div
      onDragStart={props.dragStartHandler}
      onDragEnd={props.dragEndHandler}
      draggable="true"
      className={`bg-slate-600 grid wikiTitle rounded-[2rem] p-4 items-center justify-center hover:cursor-move`}
      id={props.htmlId}
    >
      {props.wikiPage.title}
    </div>
  );
}

export default SnippetTitle;
