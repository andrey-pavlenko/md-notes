import { Trie } from './trie';

interface Note {
  url: string;
  content: any;
  meta: Meta;
  html?: string;
  sentences?: Sentance[];
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

interface Sentance {
  text: string;
  trie: Trie;
}

interface SearchNoteResult {
  weigth: number;
  matches: string[];
  text: string;
}

interface SearchNotesResult {
  note: Note,
  weigth: number;
  results: SearchNoteResult[];
}

export { Note, Meta, TagItem, ContentsItem, SearchNoteResult, SearchNotesResult};