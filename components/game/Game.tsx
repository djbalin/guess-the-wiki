"use client";

import { useEffect, useState } from "react";
import GameControls from "./InputGroup/GameControls";
import PlayingField from "./PlayingField/PlayingField";
import { LoadingStatus, Result, WikiDocument } from "@/resources/TypesEnums";
import { useGameStatusContext } from "@/contexts/GameStatusContext";

function shuffleArray(arr: any[], accumulator: any[]) {
  if (arr.length == 0) {
    return accumulator;
  } else {
    const idx = Math.floor(Math.random() * arr.length);

    const el = arr[idx];
    const spliced = arr.toSpliced(idx, 1);
    accumulator.push(el);
    return shuffleArray(spliced, accumulator);
  }
}

function produceRandomArrayIndices(length: number) {
  let array = Array.from({ length: length }, (_, i) => i);
  return shuffleArray(array, []);
}

export default function Game() {
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  function handleResize(this: Window, ev: UIEvent) {
    if (this.innerWidth < 865) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }

  // const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);

  const context = useGameStatusContext();

  const [wikiPageObjects, setWikiPageObjects] = useState<WikiDocument[]>([]);
  function onMakeGuess(guess: Map<Element, Element>): void {
    // TODO
    // TODO
    // TODO
    // NOT YET IMPLEMENTED
    // Will handle the result of the guess and provide some feedback to the user.
    const isVictory = evaluateGuess(guess);

    if (isVictory) {
      context.setGameStatusContext({
        guessHasBeenMade: true,
        result: Result.Victory,
        showPlayingField: true,
        revealSolution: true,
      });
    } else {
      context.setGameStatusContext({
        guessHasBeenMade: true,
        result: Result.Loss,
        showPlayingField: true,
        revealSolution: false,
      });
    }

    // console.log("VICTORY WAS : " + isVictory);

    // setGameIsFinished(true);
  }

  function evaluateGuess(guess: Map<Element, Element>): boolean {
    let isVictory = true;
    for (const [key, value] of guess) {
      if (key.id.substring(1) != value.id.substring(1)) {
        isVictory = false;
      }
    }
    return isVictory;
  }

  function showWikiSnippets(wikiPages: WikiDocument[]): void {
    setWikiPageObjects(wikiPages);
    context.setGameStatusContext({
      showPlayingField: true,
      guessHasBeenMade: false,
      result: 0,
      revealSolution: false,
    });
    setRandomizerArray(produceRandomArrayIndices(wikiPages.length));
    // setShowPlayingField(true);
  }

  const [randomizerArray, setRandomizerArray] = useState<number[]>([]);

  if (isSmallScreen) {
    return (
      <div className="bg-red-200 text-4xl p-8 rounded-xl w-full text-center my-16">
        This game is not optimized for mobile phones/small screens yet :({" "}
        <br></br>
        Please try to play it on a larger screen!
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-12">
      <GameControls
        onPlayGame={showWikiSnippets}
        // onPlayGame={generateAndShowWikiSnippets}
      />
      {/* <HorizontalRule showPlayingField={showPlayingField} /> */}
      {context.gameStatusContext.showPlayingField && (
        <PlayingField
          onMakeGuess={onMakeGuess}
          wikiPages={wikiPageObjects}
          randomizerArray={randomizerArray}
        />
      )}
    </div>
  );
}
