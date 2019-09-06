import Vue from 'vue';
import { action } from '@storybook/addon-actions';

export default Vue.component('router-link', {
  name: 'router-link',
  props: ['to'],
  methods: {
    onClick: action('router-link :to')
  },
  template: '<a @click="onClick(to)"><slot></slot></a>'
});
