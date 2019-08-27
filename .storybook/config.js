import { configure } from '@storybook/vue';
// import Vue from 'vue';
// import TocItem from '../src/components/toc-item';
// import Spinner from '../src/components/spinner';

// Vue.component('toc-item', TocItem);
// Vue.component('spinner', Spinner);

function loadStories() {
  require('../src/stories/index');
};

configure(loadStories, module);