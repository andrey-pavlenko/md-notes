interface Note {
  url: string;
  content: any;
  meta: Meta;
  html?: string;
}

interface Meta {
  title?: string;
  tags?: string[];
  related?: string[];
  children?: string[];
}

interface TagItem {
  label: string;
  count: number;
}

interface ContentsItem {
  title: string;
  url: string;
  children?: ContentsItem[];
}

export { Note, Meta, TagItem, ContentsItem };