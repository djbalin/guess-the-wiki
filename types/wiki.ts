export type WikiMetaData = {
  title: string;
  url: string;
  id: number;
};

export type WikiDocument = WikiMetaData & {
  content_raw: string | null;
  content_censored: string | null;
};
