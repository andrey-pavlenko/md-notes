import * as path from 'path';
import { init as initRepository } from '../repository';
import { load as loadNote } from '../note';
import { load as loadTags, notesByTag } from '../tags';

jest.mock('axios');

describe('Tags', () => {

  let notes;

  beforeAll(async () => {
    require('axios').__set('tags-00', {
      data: {
        base: path.resolve(__dirname, './cases/tags-00'),
        files: ['test1.md',  'test2.md',  'test3.md',  'test4.md',  'test5.md']
      }
    });
    const contents = await initRepository('tags-00');
    notes = await loadNote(contents);
  });

  it('load', () => {
    const tags = loadTags(notes);
    expect(tags).toEqual([
      { label: 'test1', count: 4 },
      { label: 'test2', count: 3 },
      { label: 'test3', count: 1 },
      { label: 'test5', count: 1 }
    ]);
  });

  it('by tags', () => {
    const tags = loadTags(notes);
    tags.forEach(t => {
      const n = notesByTag(notes, t.label);
      expect(n.length).toEqual(t.count);
      n.map(n => n.meta.tags).forEach(tags => expect(tags).toContain(t.label));
    });
  });
});
