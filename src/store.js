import Vue from 'vue';
import Vuex from 'vuex';
import {
  init as initRepository,
  resolve as resolveRepository
} from './modules/repository';
import { load as loadNote } from './modules/note';
import { load as loadContents } from './modules/contents';
import { load as loadTags, notesByTag } from './modules/tags';
import Marked from 'marked';

Vue.use(Vuex);

window.resolveRepository = resolveRepository;

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
        const files = await initRepository('notes/contents.json');
        Marked.setOptions({
          baseUrl: resolveRepository('')
        });
        const errorCallback = errors => console.info('Show error', errors);
        const notes = await loadNote(files, errorCallback);
        const contents = await loadContents(notes, errorCallback);
        commit('updateNotes', notes);
        commit('updateContents', contents);
        commit('updateTags', loadTags(notes));
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
        note.html = Marked(note.content);
        commit('updateNote', note);
        commit('updateProcessing', false);
      }
      return note.html;
    }
  }
});

window.store = store;

export default store;
