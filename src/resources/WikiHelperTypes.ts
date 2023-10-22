export type WikiPageObject = {
  title: string;
  content_raw: string;
  content_censored: string;
  id: number;
};

export type WikiPageTitleObject = {
  title: string;
  id: number;
};

export enum LoadingStatus {
  Idle = "IDLE",
  Loading = "LOADING",
  Error = "ERROR",
}
