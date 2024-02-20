"use client";
import { Result } from "@/resources/TypesEnums";
import React, { createContext, useContext, useState } from "react";

type GameStatus = {
  showPlayingField: boolean;
  guessHasBeenMade: boolean;
  result: Result;
};

type GameStatusContext = {
  gameStatusContext: GameStatus;
  setGameStatusContext: React.Dispatch<React.SetStateAction<GameStatus>>;
};

const GameStatusContext = createContext<GameStatusContext | null>(null);

// type CategoryContext = {
//   categoryContext: string[];
//   setCategoryContext: React.Dispatch<React.SetStateAction<string[]>>;
// };

// const CategoriesContext = createContext<CategoryContext | null>(null);

export default function GameStatusContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    showPlayingField: false,
    guessHasBeenMade: false,
    result: Result.Ongoing,
  });
  //   const [categories, setCategories] = useState<string[]>([""]);

  return (
    <GameStatusContext.Provider
      value={{
        gameStatusContext: gameStatus,
        setGameStatusContext: setGameStatus,
      }}
    >
      {children}
    </GameStatusContext.Provider>
  );
}

export function useGameStatusContext(): GameStatusContext {
  const context = useContext(GameStatusContext);

  if (!context) {
    throw new Error(
      "useGameStatusContext must be used within a gameStatusContextProvider"
    );
  }
  return context;
}
