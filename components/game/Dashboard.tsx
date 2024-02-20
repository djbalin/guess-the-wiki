"use server";
import { GameDescription } from "./GameDescription";
import Game from "./Game";
import GameStatusContextProvider from "@/contexts/GameStatusContext";

export default async function Dashboard() {
  console.log("DASHBOARD RENDERED");

  return (
    <section
      id="game-container"
      className="py-8 px-16 flex flex-col min-w-full min-h-full border-red-300 border-solid border-2"
    >
      <GameDescription />
      <GameStatusContextProvider>
        <Game></Game>
      </GameStatusContextProvider>
    </section>
  );
}
