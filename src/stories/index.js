import { storiesOf } from '@storybook/vue';

import '../styles/index.scss';

import './spinner-story';

storiesOf('TocItem', module).add('Default', () => ({
  template: "<toc-item :item=\"{title: 'Test', path: 'test.md'}\"></toc-item>"
}));
