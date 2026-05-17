"use server";
import Game from "./Game";
import GameStatusContextProvider from "@/contexts/GameStatusContext";

export default async function Dashboard() {
  return (
    <GameStatusContextProvider>
      <Game />
    </GameStatusContextProvider>
  );
}
