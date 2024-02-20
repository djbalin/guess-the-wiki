"use client";

import { useState } from "react";
import InputGroup from "./InputGroup/InputGroup";
import PlayingField from "./PlayingField/PlayingField";
import { LoadingStatus, Result, WikiDocument } from "@/resources/TypesEnums";
import { useGameStatusContext } from "@/contexts/GameStatusContext";
export default function Game() {
  // const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.Idle
  );
  console.log("GAME RENDERED");

  // const [showPlayingField, setShowPlayingField] = useState<boolean>(false);

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
      });
    } else {
      context.setGameStatusContext({
        guessHasBeenMade: true,
        result: Result.Loss,
        showPlayingField: true,
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
    });
    // setShowPlayingField(true);
  }
  return (
    <div className="flex flex-col gap-y-12">
      <InputGroup
        onPlayGame={showWikiSnippets}
        // onPlayGame={generateAndShowWikiSnippets}
        loadingStatus={loadingStatus}
      />
      {/* <HorizontalRule showPlayingField={showPlayingField} /> */}
      {context.gameStatusContext.showPlayingField && (
        <PlayingField onMakeGuess={onMakeGuess} wikiPages={wikiPageObjects} />
      )}
    </div>
  );
}
