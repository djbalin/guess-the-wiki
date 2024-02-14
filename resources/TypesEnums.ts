export type WikiDocument = {
  title: string;
  content_raw: string | null;
  content_censored: string | null;
  url: string;
  id: number;
};

// export type WikiPageTitleObject = {
//   title: string;
//   id: number;
// };

export enum LoadingStatus {
  Idle = "IDLE",
  Loading = "LOADING",
  Error = "ERROR",
}

export enum BackgroundColors {
  SATURATED = "rgb(51 65 85)",
  UNSATURATED = "rgb(34 211 238)",
  CURRENTLY_DRAGGED_OVER = "#f3af99",
  CORRECT = "rgb(22 163 74)",
  INCORRECT = "rgb(185 28 28)",
}
