import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';
import AsyncComputed from 'vue-async-computed';
import './styles/index.scss';
import './styles/icons/icons.svg';

Vue.config.productionTip = false;

Vue.use(AsyncComputed);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

// store.dispatch('fetchContents');
