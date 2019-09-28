import { storiesOf } from '@storybook/vue';
import { withKnobs, text, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import SearchInput from '../components/search-input';

storiesOf('Search-input', module)
  .addDecorator(withKnobs)
  .add('main', () => ({
    components: {
      SearchInput
    },
    data() {
      return {
        inputValue: this.value
      };
    },
    props: {
      value: {
        type: String,
        default: text('Input', 'Привет')
      },
      size: {
        type: String,
        default: select('Size', {
          normal: '',
          small: 'small',
          medium: 'medium',
          large: 'large'
        })
      }
    },
    watch: {
      value(newValue) {
        this.inputValue = newValue;
      }
    },
    template: `<section class="section">
      <div class="field">
        <SearchInput :size="size" :value.sync="inputValue" />
      </div>
    </section>`
  }));
