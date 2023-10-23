import { useState } from "react";
import "./App.css";
import PlayingField from "./components/PlayingField/PlayingField";
import "./scripts/api_helper";
import { fetchAndSnippetRandomWikiPages } from "./scripts/api_helper";
import InputGroup from "./components/InputGroup/InputGroup";
import { Header } from "./components/Header";
import { LoadingStatus, WikiPageObject } from "./resources/WikiHelperTypes";

function App() {
  const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.Idle
  );

  const [showPlayingField, setShowPlayingField] = useState<boolean>(false);

  const [wikiPageObjects, setWikiPageObjects] = useState<WikiPageObject[]>([]);

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
    // gameIsFinished;
    // guess.size;
    return false;
  }

  async function fetchWikiSnippets(num_pages: number, snippet_length: number) {
    const wikiPageObjects = await fetchAndSnippetRandomWikiPages(
      num_pages,
      snippet_length
    );
    if (wikiPageObjects != null) {
      setWikiPageObjects(wikiPageObjects);
    } else {
      throw new Error("Error fetching Wiki snippets");
    }
  }

  async function generateAndShowWikiSnippets(
    num_pages: number,
    snippet_length: number
  ): Promise<void> {
    try {
      setLoadingStatus(LoadingStatus.Loading);
      await fetchWikiSnippets(num_pages, snippet_length);
      setLoadingStatus(LoadingStatus.Idle);
      setShowPlayingField(true);
    } catch (error) {
      console.log(error);
      setLoadingStatus(LoadingStatus.Error);
    }
  }

  return (
    <div className="p-8 w-auto border-red-300 border-solid border-2">
      <Header />
      <InputGroup
        onGenerateSnippets={generateAndShowWikiSnippets}
        loadingStatus={loadingStatus}
      />
      {showPlayingField && (
        <PlayingField
          onMakeGuess={onMakeGuess}
          wikiPageObjects={wikiPageObjects}
        />
      )}
    </div>
  );
}

export default App;
