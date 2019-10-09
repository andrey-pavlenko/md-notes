import Vue from 'vue';
import Vuex from 'vuex';
import { init, load, baseUrl } from './modules/repository';
import {
  createNote,
  createContents,
  createTags,
  notesByTag,
  sentencenize,
  searchNotes
} from './modules/note';
import { stem } from './modules/stem-ru';
import { toHtml, setOptions as setMarkedOptions } from './modules/marked/index';
import { notify, DELAY_ERROR } from '@/components/notification/index';

Vue.use(Vuex);

const INIT_URL =
  process && process.env && process.env.NODE_ENV === 'production'
    ? 'https://dofuri-proxy.herokuapp.com/notes'
    : 'notes/contents.json';

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
    notesByTag: state => tag => notesByTag(state.notes, tag),
    notesBySearchPattern: state => pattern => {
      let stemmedPattern = stem(pattern) || pattern;
      return searchNotes(state.notes, stemmedPattern);
    }
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
        const errorCallback = errors => {
          const errs = errors.map(error => {
            let message = 'Неизвестная ошибка';
            if (error.reason && error.reason.statusText) {
              if (error.reason && error.reason.status) { 
                message = error.reason.status.toString() + ' ';
              }
              message += error.reason.statusText;
            }
            return `<li><strong>${error.url}</strong> &ndash; <small>${message}</small></li>`;
          })
          notify({
            header: 'Ошибки чтения файлов:',
            message: '<ul>' + errs.join('') + '</ul>',
            style: 'danger',
            timeout: DELAY_ERROR
          });
        };
        const notes = (await load(files, errorCallback))
          .map((text, idx) => createNote(files[idx], text))
          .filter(note => !!note)
          .map(note => sentencenize(note));
        const contents = await createContents(notes, errorCallback);
        commit('updateNotes', notes.filter(note => !!note));
        commit('updateContents', contents);
        commit('updateTags', createTags(notes));
      } catch (e) {
        notify({
          header: 'Ошибка загрузки содержания:',
          message: e.toString(),
          style: 'danger',
          timeout: DELAY_ERROR,
        });
      }
      commit('updateProcessing', false);
    },
    async getHtml({ getters, commit }, url) {
      const note = getters.noteByUrl(url);
      if (!note) {
        const error = `Файл ${url} не найден`;
        notify({
          message: error,
          style: 'danger',
          timeout: DELAY_ERROR,
        });
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
