import Vue from 'vue';
import Vuex from 'vuex';
import { init as initRepository } from './modules/repository';
import { load as loadNote } from './modules/note';
import { load as loadContents } from './modules/contents';
import Marked from 'marked';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    processing: false,
    error: false,
    notes: [],
    contents: []
  },
  getters: {
    noteByUrl: state => url => state.notes.find(n => n.url === url)
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
    }
  },
  actions: {
    async init({ commit }) {
      commit('updateProcessing', true);
      try {
        const files = await initRepository('notes/contents.json');
        const errorCallback = errors => console.info('Show error', errors);
        const notes = await loadNote(files, errorCallback);
        const contents = await loadContents(notes, errorCallback);
        commit('updateNotes', notes);
        commit('updateContents', contents);
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

export default store;
