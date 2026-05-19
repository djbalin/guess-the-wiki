// store.ts
import { LanguageCode } from "@/types/language";
import { create } from "zustand";

// Define types for state & actions
type Params = {
  numPages: number;
  snippetLength: number;
  seed: number;
  lang: LanguageCode;
  ids: string[] | undefined;
};

type State = {
  setGameParams: (params: Params) => void;
  setIsActive: (isActive: boolean) => void;
  gameParams: Params;
  isActive: boolean;
};

// Create store using the curried form of `create`
export const useGameStore = create<State>()((set) => ({
  gameParams: {
    ids: undefined,
    lang: "en" as const,
    numPages: 3,
    seed: Math.random(),
    snippetLength: 30,
  },
  isActive: false,
  setIsActive(newIsActive) {
    return set({ isActive: newIsActive });
  },
  setGameParams: (newParams) => {
    console.log("Setting new params:");
    console.log(newParams);
    return set({ gameParams: newParams });
  },
}));
