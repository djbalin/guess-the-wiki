"use client";

import { useState } from "react";
import { HorizontalRule } from "./HorizontalRule";
import InputGroup from "./InputGroup/InputGroup";
import PlayingField from "./PlayingField/PlayingField";
import { LoadingStatus, WikiDocument } from "@/resources/TypesEnums";
import {
  fetchAndSnippetRandomWikiPages,
  fetchRandomWikiPageTitles,
} from "@/scripts/api_helper";

export default function Game() {
  const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.Idle
  );

  const [showPlayingField, setShowPlayingField] = useState<boolean>(false);

  const [wikiPageObjects, setWikiPageObjects] = useState<WikiDocument[]>([]);
  function onMakeGuess(guess: Map<Element, Element | null>): void {
    // TODO
    // TODO
    // TODO
    // NOT YET IMPLEMENTED
    // Will handle the result of the guess and provide some feedback to the user.
    evaluateGuess(guess);
    setGameIsFinished(true);
  }

  function evaluateGuess(guess: Map<Element, Element | null>): boolean {
    //
    // TODO
    // TODO
    // TODO
    //
    gameIsFinished;
    guess.size;
    return false;
  }

  function showWikiSnippets(wikiPages: WikiDocument[]): void {
    setWikiPageObjects(wikiPages);
    setShowPlayingField(true);
  }

  // async function generateAndShowWikiSnippets(
  //   num_pages: number,
  //   snippet_length: number
  // ): Promise<void> {
  //   try {
  //     setLoadingStatus(LoadingStatus.Loading);
  //     const wikiPageObjects = await fetchAndSnippetRandomWikiPages(
  //       num_pages,
  //       snippet_length
  //     );
  //     if (wikiPageObjects != null) {
  //       setWikiPageObjects(wikiPageObjects);
  //     } else {
  //       throw new Error("Error fetching Wiki snippets");
  //     }
  //     setLoadingStatus(LoadingStatus.Idle);
  //     setShowPlayingField(true);
  //   } catch (error) {
  //     console.log(error);
  //     setLoadingStatus(LoadingStatus.Error);
  //   }
  // }

  return (
    <div className="">
      <InputGroup
        onPlayGame={showWikiSnippets}
        // onPlayGame={generateAndShowWikiSnippets}
        loadingStatus={loadingStatus}
      />
      <HorizontalRule showPlayingField={showPlayingField} />
      {showPlayingField && (
        <PlayingField
          onMakeGuess={onMakeGuess}
          wikiPageObjects={wikiPageObjects}
        />
      )}
    </div>
  );
}
