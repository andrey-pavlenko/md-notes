import * as path from 'path';
import { Repository } from '../repository';
import { createNote, tags, notesByTag } from '../note';
import { notFoundReason } from './spec-utils/index';

jest.mock('axios');

describe('Tags', () => {
  let notes;
  const errorCallback = jest.fn();
  const data = {
    base: path.resolve(__dirname, './cases/tags-00'),
    files: [
      'test1.md',
      'test2.md',
      'test3.md',
      'test4.md',
      'test5.md',
      'test99.md'
    ],
  };

  beforeAll(async () => {
    require('axios').__set('tags-00', {
      data: data,
    });
    const repository = new Repository();
    const files = await repository.init('tags-00');
    notes = await repository.load(files, errorCallback);
    notes = notes.map((content, idx) => createNote(files[idx], content));
  });

  it('check prepeared', () => {
    expect(notes).toHaveLength(data.files.length);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: 'test99.md',
      reason: notFoundReason
    }]);
  });

  it('get tags', () => {
    const tagItems = tags(notes);
    expect(tagItems).toEqual([
      { label: 'test1', count: 4 },
      { label: 'test2', count: 3 },
      { label: 'test3', count: 1 },
      { label: 'test5', count: 1 },
    ]);
  });

  it('by tags', () => {
    const tagItems = tags(notes);
    tagItems.forEach(t => {
      const n = notesByTag(notes, t.label);
      expect(n.length).toEqual(t.count);
      n.map(n => n.meta.tags).forEach(tags => expect(tags).toContain(t.label));
    });
  });
});
