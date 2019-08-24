interface Loaded {
  success: any[],
  errors?: string[]
};

interface Meta {
  title?: string,
  tags?: string[],
  related?: string[],
  children?: string[]
};

interface Note {
  path: string,
  meta: Meta,
  content: string,
  html?: string
};

interface TocItem {
  title: string,
  path: string,
  children?: TocItem[]
};

export { Note, Meta, TocItem, Loaded };