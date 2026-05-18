export type WikiMetaData = {
  title: string;
  fullurl: string;
  pageid: number;
};

export type WikiDocument = WikiMetaData & {
  content_raw: string | null;
  content_censored: string | null;
};
