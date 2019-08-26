interface Meta {
  title?: string,
  tags?: string[],
  related?: string[],
  children?: string[]
};

interface Note {
  url: string,
  content: any,
  meta?: Meta,
  html?: string
};

interface Error {
  url: string,
  reason: any
};

type ErrorCallback = (errors: Error[]) => void;

interface ContentsItem {
  title: string,
  url: string,
  children?: ContentsItem[]
};

export { Meta, Note, Error, ErrorCallback, ContentsItem }