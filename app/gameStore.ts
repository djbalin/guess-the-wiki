// store.ts
import { DEFAULT_DIFFICULTY, Difficulty } from "@/types/game";
import { DEFAULT_LANGUAGE, LanguageCode } from "@/types/language";
import { create } from "zustand";

// Define types for state & actions
type Params = {
  numPages: number;
  snippetLength: number;
  seed: number;
  lang: LanguageCode;
  ids: string[] | undefined;
  difficulty: Difficulty;
};

type State = {
  setGameParams: (params: Params) => void;
  setIsGameActive: (isActive: boolean) => void;
  gameParams: Params;
  isGameActive: boolean;
};

// Create store using the curried form of `create`
export const useGameStore = create<State>()((set) => ({
  gameParams: {
    ids: undefined,
    lang: DEFAULT_LANGUAGE,
    numPages: 3,
    seed: Math.random(),
    snippetLength: 30,
    difficulty: DEFAULT_DIFFICULTY,
  },
  isGameActive: false,
  setIsGameActive(newIsActive) {
    return set({ isGameActive: newIsActive });
  },
  setGameParams: (newParams) => {
    console.log("Setting new params:");
    console.log(newParams);
    return set({ gameParams: newParams });
  },
}));
