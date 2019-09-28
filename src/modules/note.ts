/* eslint-disable */
import {
  Note,
  Meta,
  ContentsItem,
  TagItem,
  SearchNoteResult,
  SearchNotesResult,
} from './notes.d';
import { load } from './repository';
import { LoadError } from './repository.d';
import {
  sentencenize as sentencenizeText,
  tokenize,
  stopWordsRu,
  stopWordsEn,
  removeStopWords,
} from './search';
import { toText } from './marked';
import { Trie, weigth as matchWeight } from './trie';

const stopWords = [].concat(stopWordsEn, stopWordsRu);

function createNote(url: string, content: string): Note | null {
  return content === null
    ? null
    : {
        url,
        content,
        meta: createMeta(content),
      };
}

function createMeta(content: string): Meta | undefined {
  const meta: Meta = getMetaFromComment(content);
  if (!meta.title) {
    const title = getTitle(content);
    if (title) {
      meta.title = title;
    }
  }
  return meta;
}

function getTitle(text: string): string | undefined {
  const titleRegex = /^#+\s*([\s\S]*?)\n\n/m;
  const match = text.match(titleRegex);
  if (match) { return match[1].split('\n').join(' '); }
}

function getMetaFromComment(text: string): Meta {
  const metaRegex = /^<!-{2,3}\s*(\{[\s\S]*\})\s*-->$/;
  return Object.assign(
    {},
    ...text
      .split(/(<!-{2,3}[\s\S]*?-->)/)
      .filter((s) => metaRegex.test(s))
      .map((s) => {
        try {
          return JSON.parse(s.replace(metaRegex, '$1'));
        } catch {
          return {};
        }
      }),
  );
}

function createTags(notes: Note[]): TagItem[] {
  const tags: TagItem[] = [];

  notes
    .filter((note) => note !== null)
    .forEach((note) => {
      if (note.meta.tags && note.meta.tags.length) {
        note.meta.tags.forEach((t) => {
          const tag: TagItem = tags.find((aTag) => aTag.label === t);
          if (tag) {
            tag.count += 1;
          } else {
            tags.push({
              label: t,
              count: 1,
            });
          }
        });
      }
    });
  return tags;
}

function notesByTag(notes: Note[], tag: string): Note[] {
  return notes.filter(
    (note) => note && note.meta && note.meta.tags && note.meta.tags.includes(tag),
  );
}

async function createContents(
  notesRef: Note[],
  errorsCallback?: (errors: LoadError[]) => void,
): Promise<ContentsItem[]> {
  return Promise.all(
    notesRef.map((note) => getContentItem(note, notesRef, errorsCallback)),
  );
}

async function getContentItem(
  note: Note,
  notesRef: Note[],
  errorsCallback?,
): Promise<ContentsItem> {
  if (note === null) { return null; }
  const item: ContentsItem = {
    title: note.meta.title || note.url,
    url: note.url,
  };
  if (note.meta.children && note.meta.children.length) {
    return new Promise((resolve) => {
      Promise.all(
        note.meta.children.map((child) =>
          findOrLoadhNote(child, notesRef, errorsCallback),
        ),
      ).then((children) => {
        Promise.all(
          children
            .filter((n) => !!n)
            .map((n) => getContentItem(n, notesRef, errorsCallback)),
        ).then((i) => {
          item.children = i;
          resolve(item);
        });
      });
    });
  }
  return item;
}

async function findOrLoadhNote(
  url: string,
  notesRef: Note[],
  errorsCallback?,
): Promise<Note> {
  const existsNote = notesRef.find((n) => n.url === url);
  if (existsNote) {
    return existsNote;
  }
  const note = createNote(url, (await load(url, errorsCallback))[0]);
  if (note !== null) { notesRef.push(note); }
  return note;
}

function sentencenize(note: Note): Note {
  note.sentences = sentencenizeText(toText(note.content)).map((sentence) => ({
    text: sentence,
    trie: new Trie().add(removeStopWords(tokenize(sentence), stopWords)),
  }));
  return note;
}

function searchNote(note: Note, pattern: string): SearchNoteResult[] {
  return note.sentences && note.sentences.length ?
    note.sentences
      .map((sentence) => {
        const matches = sentence.trie.match(pattern);
        const weigth = matchWeight(pattern, matches);
        if (weigth > 0) {
          return {
            weigth,
            matches,
            text: sentence.text,
          };
        }
      })
      .filter((result) => !!result)
      .sort((a, b) => b.weigth - a.weigth)
    : [];
}

function searchNotes(notes: Note[], pattern: string): SearchNotesResult[] {
  return notes && notes.length ?
    notes
      .map((note) => {
        const results = searchNote(note, pattern);
        return results.length ? {
          note,
          weigth: results.reduce((acc, result) => acc + result.weigth, 0),
          results,
        } : null;
      })
      .filter((result) => !!result)
      .sort((a, b) => b.weigth - a.weigth)
   : [];
}

export { createNote, createTags, notesByTag, createContents, sentencenize, searchNote, searchNotes };
