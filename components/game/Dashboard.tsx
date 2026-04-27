"use server";
import Game from "./Game";
import GameHeader from "./GameHeader";
import GameStatusContextProvider from "@/contexts/GameStatusContext";

export default async function Dashboard() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <GameHeader />
      <GameStatusContextProvider>
        <Game />
      </GameStatusContextProvider>
    </div>
  );
}
