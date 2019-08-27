import { storiesOf } from '@storybook/vue';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TagItem from '../components/tags/tag-item';
import TagsContainer from '../components/tags/tags-container';

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const tags = [
  'vue',
  'vuex',
  'npm',
  'yarn',
  'express',
  'cross',
  'js',
  'openfl',
  'utility',
  'neko',
  'flash',
  'cpp',
  'web',
  'game',
  'haxe',
  'android',
  'ios',
  'html5',
  'extern',
  'javascript',
  'nodejs',
  'native',
  'react',
  'macro',
  'php',
  'tink',
  'ui',
  'html',
  'mvc',
  'java',
  'nme',
  'api',
  'parser',
  'extension',
  'cs',
  'framework',
  'async',
  'python',
  'http',
  'cli',
  'ufront',
  'json',
  'google',
  '3d',
  'math',
  'gui',
  'functional',
  'tool',
  'hexmachina',
  'template',
  'node',
  'cross-platform',
  'thx',
  'entity',
  'xml'
]
  .sort()
  .map(t => ({
    label: t,
    count: random(1, 100)
  }));

storiesOf('Tags', module)
  .addDecorator(withKnobs)
  .add('TagItem', () => ({
    props: {
      label: {
        type: String,
        default: text('Label', 'storybook')
      },
      count: {
        type: Number,
        default: number('Count', 12345, {
          range: true,
          min: 1,
          max: 10000000
        })
      }
    },
    components: { TagItem },
    template: '<TagItem :label="label" :count="count" />'
  }))
  .add('TagsContainer', () => ({
    props: {
      total: {
        type: Number,
        default: number('Total', tags.length, {
          range: true,
          min: 1,
          max: tags.length,
          step: 1
        })
      }
    },
    computed: {
      selectedTags() {
        return tags.slice(0, this.total);
      }
    },
    methods: {
      onClick: action('TagsContainer @click')
    },
    components: { TagsContainer },
    template: '<TagsContainer :tags="selectedTags" @click="onClick" />'
  }));
