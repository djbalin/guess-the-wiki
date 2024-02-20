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

export default function Game() {
  // const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);

  console.log("GAME RENDERED");

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

    console.log("VICTORY WAS : " + isVictory);

    // setGameIsFinished(true);
  }

  function evaluateGuess(guess: Map<Element, Element>): boolean {
    console.log("EVALUATING GUESS");
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
    setRandomizer(Math.random());
    // setShowPlayingField(true);
  }

  const [randomizer, setRandomizer] = useState<number>(Math.random());

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
          randomizer={randomizer}
        />
      )}
    </div>
  );
}
