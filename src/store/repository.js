// @ts-ignore
import { writable } from 'svelte/store';
import Repository from '../modules/repository';
import options from '../options';

const loading = writable(false);
const error = writable(undefined);
const assets = writable(null);

async function init() {
  const readedRepository = Repository.read();
  if (readedRepository != null) {
    options.notePaths = readedRepository._notes.map(
      note => note.path
    );
    assets.set(readedRepository);
  }
  loading.set(true);
  try {
    const loadedRepository = await Repository.load();
    options.notePaths = loadedRepository._notes.map(
      note => note.path
    );
    assets.set(loadedRepository);
    error.set(null);
    loadedRepository.write();
  } catch (e) {
    console.error(e);
    error.set(e);
  }
  loading.set(false);
}

export { loading, error, assets, init };
