import {
  DK,
  GB,
  FR,
  DE,
  ES,
  FlagComponent,
} from "country-flag-icons/react/3x2";

export type WikiMetaData = {
  title: string;
  url: string;
  id: number;
};

export type WikiDocument = WikiMetaData & {
  content_raw: string | null;
  content_censored: string | null;
};

// export enum DifficultyTitlesENUM {
//   Easy = "Easy",
//   Medium = "Medium",
//   Hard = "Hard",
//   Extreme = "Extreme",
// }
// export type DifficultyTitles = "Easy" | "Medium" | "Hard" | "Extreme";

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

// export enum Languages {
//   Danish = "da",
//   English = "en",
//   French = "fr",
//   Spanish = "es",
//   German = "de",
// }

// export type Language = Languages;

// export type Languages = { dk: string | "en": string | "fr": string };

export const flagComponents: { [key: string]: FlagComponent } = {
  da: DK,
  fr: FR,
  gb: GB,
  de: DE,
  es: ES,
};

// export const DEFAULT_LANGUAGE = Languages.English;
