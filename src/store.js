import Vue from 'vue';
import Vuex from 'vuex';
import { init, load, baseUrl } from './modules/repository';
import {
  createNote,
  createContents,
  createTags,
  notesByTag
} from './modules/note';
import {
  toHtml,
  toText,
  setOptions as setMarkedOptions
} from './modules/marked';
import natural from 'natural';

window.natural = natural;
window.toText = toText;

Vue.use(Vuex);

const INIT_URL = 'notes/contents.json';

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    processing: false,
    error: false,
    notes: [],
    contents: [],
    tags: []
  },
  getters: {
    noteByUrl: state => url => state.notes.find(n => n.url === url),
    noteTags: state => note =>
      state.tags.filter(t => {
        if (note.meta.tags && note.meta.tags.length) {
          return note.meta.tags.includes(t.label);
        }
        return false;
      }),
    notesByTag: state => tag => notesByTag(state.notes, tag)
  },
  mutations: {
    updateNotes(state, notes) {
      state.notes = notes;
    },
    updateNote(state, note) {
      state.notes = [].concat(
        state.notes.filter(n => n.url !== note.url),
        note
      );
    },
    updateProcessing(state, processing) {
      state.processing = processing;
    },
    updateError(state, error) {
      state.error = error;
    },
    updateContents(state, contents) {
      state.contents = contents;
    },
    updateTags(state, tags) {
      state.tags = tags.sort((a, b) => a.label.localeCompare(b.label));
    }
  },
  actions: {
    async init({ commit }) {
      commit('updateProcessing', true);
      try {
        const files = await init(INIT_URL);
        setMarkedOptions({ baseUrl: baseUrl() });
        const errorCallback = errors => console.info('Show error', errors);
        const notes = (await load(files, errorCallback))
          .map((text, idx) => createNote(files[idx], text))
          .filter(note => !!note);
        const contents = await createContents(notes, errorCallback);
        commit('updateNotes', notes.filter(note => !!note));
        commit('updateContents', contents);
        commit('updateTags', createTags(notes));
      } catch (e) {
        console.error(e);
      }
      commit('updateProcessing', false);
    },
    async getHtml({ getters, commit }, url) {
      const note = getters.noteByUrl(url);
      if (!note) {
        const error = `Файл ${url} не найден`;
        console.error(error);
        throw error;
      }
      if (!note.html) {
        commit('updateProcessing', true);
        note.html = toHtml(note.content);
        commit('updateNote', note);
        commit('updateProcessing', false);
      }
      return note.html;
    }
  }
});

window.store = store;

export default store;
