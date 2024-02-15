"use server";
import { LoadingStatus, WikiDocument } from "@/resources/TypesEnums";
import { useState } from "react";
import { HorizontalRule } from "./HorizontalRule";
import InputGroup from "./InputGroup/InputGroup";
import PlayingField from "./PlayingField/PlayingField";

import { GameDescription } from "./GameDescription";
import { fetchAndSnippetRandomWikiPages } from "@/scripts/api_helper";
import Game from "./Game";

export default async function Dashboard() {
  console.log("DASHBOARD RENDERED");

  return (
    <section
      id="game-container"
      className="py-8 px-16 flex flex-col min-w-full min-h-full border-red-300 border-solid border-2"
    >
      <GameDescription />

      <Game></Game>
    </section>
  );
}
