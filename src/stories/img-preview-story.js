import { storiesOf } from '@storybook/vue';
// import { withKnobs, text, number } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import ImgPreview from '../components/img-preview';
import imgForPreview1 from './img-preview-1.jpg';
import imgForPreview2 from './img-preview-2.jpg';

storiesOf('Image Preview', module).add('Main', () => ({
  components: {
    ImgPreview
  },
  data: function() {
    return {
      imgForPreview: null
    };
  },
  methods: {
    onImgClick: function(event) {
      this.imgForPreview = event.target.src;
    }
  },
  template: `<div>
  <ImgPreview v-if="imgForPreview" :src="imgForPreview" @close="imgForPreview=null" />
  <p><img src="${imgForPreview1}" style="cursor: zoom-in" @click="onImgClick" /></p>
  <p><img src="${imgForPreview2}" style="cursor: zoom-in" @click="onImgClick" /></p>
</div>`
}));
