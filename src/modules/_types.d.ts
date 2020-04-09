interface BaseFile {
  url: string;
  path: string;
  content?: string;
  error?: string;
}

export interface CacheNote extends BaseFile {
  isRootTocItem?: boolean;
}

export interface NoteMeta {
  title?: string;
  children?: string[];
  related?: string[];
  tags?: string[];
}

export interface NoteInfo extends BaseFile {
  isRootTocItem?: boolean;
}

export interface StorageContents {
  base: string;
  files: string[];
}

export interface StorageFile extends BaseFile { }

export interface TagItem {
  title: string;
  referenceCount: number;
}

export interface TocItem {
  path: string;
  title: string;
  children?: TocItem[];
}
