import { DIFFICULTY_LEVELS } from "@/lib/constants";

export enum Difficulties {
  Easy,
  Medium,
  Hard,
  Extreme,
}

export enum LoadingStatus {
  Idle = "IDLE",
  Loading = "LOADING",
  Error = "ERROR",
}

export enum Result {
  Ongoing = 0,
  Victory = 1,
  Loss = -1,
}

export enum BackgroundColors {
  SATURATED = "rgb(51 65 85)",
  UNSATURATED = "rgb(34 211 238)",
  EMPHASIZED = "#f3af99",
  CORRECT = "rgb(22 163 74)",
  INCORRECT = "rgb(185 28 28)",
}
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];
export const DEFAULT_DIFFICULTY: Difficulty = "medium";

export const DIFFICULTY_SETTINGS: {
  [key in Difficulty]: { numPages: number; snippetLength: number };
} = {
  easy: { numPages: 2, snippetLength: 50 },
  medium: { numPages: 3, snippetLength: 30 },
  hard: { numPages: 4, snippetLength: 25 },
  extreme: { numPages: 5, snippetLength: 10 },
} as const;
