import { DK, GB, FR, DE, ES } from "country-flag-icons/react/3x2";
import Flag from "country-flag-icons/react/3x2";

export type WikiDocument = {
  title: string;
  content_raw: string | null;
  content_censored: string | null;
  url: string;
  id: number;
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
  CURRENTLY_DRAGGED_OVER = "#f3af99",
  CORRECT = "rgb(22 163 74)",
  INCORRECT = "rgb(185 28 28)",
}

export enum Languages {
  Danish = "da",
  English = "en",
  French = "fr",
  Spanish = "es",
  German = "de",
}

export type Language = Languages;

// export type Languages = { dk: string | "en": string | "fr": string };

export enum Countries {
  Denmark = "DK",
  UnitedKingdom = "GB",
  France = "FR",
  Spain = "ES",
  Germany = "DE",
}

export const flagComponents: { [key: string]: Flag.FlagComponent } = {
  da: DK,
  fr: FR,
  gb: GB,
  de: DE,
  es: ES,
};

export const DEFAULT_LANGUAGE = Languages.English;
