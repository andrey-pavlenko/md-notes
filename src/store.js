import Vue from 'vue';
import Vuex from 'vuex';
import { fetchContents, fetchNote } from './modules/notes';
import { getToc } from './modules/toc';
import Marked from 'marked';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    processing: false,
    error: false,
    notes: [],
    toc: []
  },
  getters: {
    noteByPath: state => path => state.notes.find(n => n.path === path)
  },
  mutations: {
    updateNotes(state, notes) {
      state.notes = notes;
    },
    updateNote(state, note) {
      state.notes = [].concat(
        state.notes.filter(n => n.path !== note.path),
        note
      );
    },
    updateProcessing(state, processing) {
      state.processing = processing;
    },
    updateError(state, error) {
      state.error = error;
    },
    updateToc(state, toc) {
      state.toc = toc;
    }
  },
  actions: {
    async fetchContents({ commit }) {
      commit('updateProcessing', true);
      try {
        const contents = await fetchContents();
        const notes = await Promise.all(contents.map(url => fetchNote(url)));
        const toc = await getToc(notes);
        commit('updateNotes', notes);
        commit('updateToc', toc);
      } catch (e) {
        console.error(e);
      }
      commit('updateProcessing', false);
    },
    async getNoteHtml({ getters, commit }, path) {
      const note = getters.noteByPath(path);
      if (!note) {
        const error = `Файл ${path} не найден`;
        console.error(error);
        commit('updateError', error);
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

// store.dispatch('fetchContents');
// window.store = store;

export default store;
