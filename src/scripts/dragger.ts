// const draggables: NodeListOf<Element> = document.querySelectorAll(".wikiTitle");
// const dropTargets: NodeListOf<Element> =
//   document.querySelectorAll(".wikiSnippet");

// console.log(draggables);
// console.log(dropTargets);

// const snippetsContainer: Element | null =
//   document.getElementById("snippetsContainer");

// var cloneIdCounter = 0;

// var dropTargetsSaturated: Map<Element, boolean> = new Map();
// for (const dropTarget of dropTargets) {
//   dropTargetsSaturated.set(dropTarget, false);
// }
// console.log(dropTargetsSaturated);

// let currentlyDragging: Element | null = null;
// let dropLocationvalid: boolean | null = null;

// // draggables.forEach((draggable) => {
// //   draggable.addEventListener("dragstart", () => {
// //     console.log("drag start");
// //   });
// // });

// // Source: https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/
// // and: https://www.youtube.com/watch?v=jfYWwQrtzzY

// export const handleDragStart = (
//   event: React.DragEvent<HTMLDivElement>
// ): void => {
//   //   event.preventDefault();
//   event.dataTransfer.effectAllowed = "copyMove";
//   console.log("drag start");

//   const target = event.target as Element;
//   currentlyDragging = target;
//   target.classList.add("currently_dragging");

//   event.dataTransfer.setData("text", event.currentTarget.id);
// };

// export const handleDragEnd = (event: React.DragEvent<HTMLDivElement>): void => {
//   const target = event.target as Element;

//   if (!dropLocationvalid) {
//     target.classList.remove("currently_dragging");
//   }

//   currentlyDragging = null;
// };

// export const handleDragDrop = (
//   event: React.DragEvent<HTMLDivElement>
// ): void => {
//   const dropTarget = event.target as Element;
//   // dropTarget.classList.remove("currently_dragging");
//   console.log("DROPED. target: " + dropTarget.innerHTML);
//   console.log("DROPED. currentlydragging: " + currentlyDragging?.innerHTML);

//   // The drop action is valid if the dropTarget has not already had something dropped in it.
//   if (!dropTargetsSaturated.get(dropTarget)) {
//     dropTargetsSaturated.set(dropTarget, true);
//     currentlyDragging!.setAttribute("draggable", "false");
//     // currentlyDragging?.classList.remove("draggable");

//     const clonedDragElement: Element = currentlyDragging!.cloneNode(
//       true
//     ) as Element;

//     clonedDragElement.id = (++cloneIdCounter).toString();
//     clonedDragElement.classList.remove("currently_dragging");

//     snippetsContainer!.insertBefore(clonedDragElement, dropTarget);
//     // currentlyDragging as Node;
//     // dropTarget.appendChild(currentlyDragging);

//     dropLocationvalid = true;
//     currentlyDragging = null;

//     // Otherwise, something has already been dropped in the target, and we "reset".
//   } else {
//     console.log("Invalid drop location");

//     dropLocationvalid = false;
//     currentlyDragging = null;
//   }

//   // console.log(dropTargetsSaturated.get(dropTarget));
// };

// export const handleDragOver = (
//   event: React.DragEvent<HTMLDivElement>
// ): void => {
//   event.preventDefault();
//   console.log("Drag over: " + event.target);
//   const target = event.target as Element;
//   target.classList.add("currently_dragging_over");
// };

// export const handleDragLeave = (
//   event: React.DragEvent<HTMLDivElement>
// ): void => {
//   event.preventDefault();
//   console.log("Drag leave: " + event.target);
//   const target = event.target as Element;
//   target.classList.remove("currently_dragging_over");
// };

// // window.addEventListener("DOMContentLoaded", () => {
// //   // Get the element by id
// //   const element = document.getElementsByClassName("wikiTitle");
// //   const el1: EventTarget = element[0];
// //   el1.addEventListener("dragstart", dragstart_handler);
// //   //   const element = document.getElementById("p1");
// //   // Add the ondragstart event listener
// //   //   if (element != null) {
// //   //     for (const el of element) {
// //   //       el.addEventListener("dragstart", dragstart_handler, false);
// //   //     }
// //   //   }
// // });
// // // </script>
