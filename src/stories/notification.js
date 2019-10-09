import { storiesOf } from '@storybook/vue';
import Notification from '@/components/notification/index'
import { DELAY_NORMAL, notify } from '@/components/notification/index'
// import { withKnobs, text, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

storiesOf('Notification', module)
  // .addDecorator(withKnobs)
  .add('main', () => ({
    components: {
      Notification,
    },
    data() {
      return {
        header: '',
        message: '',
        style: '',
        timeout: DELAY_NORMAL,
      };
    },
     methods: {
       onNotify() {
        notify({ ...this.$data });
      },
    },
    template: `<div class="container">
      <Notification />
      <section @submit.prevent="onNotify">
        <form>
          <div class="field">
            <label class="label">Header</label>
            <div class="control">
              <input class="input" type="text" placeholder="Header" v-model="header">
            </div>
          </div>
          <div class="field">
            <label class="label">Message</label>
            <div class="control">
              <textarea class="textarea" placeholder="Message" v-model="message" required></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Style</label>
            <div class="control is-expanded">
              <div class="select is-fullwidth">
                <select v-model="style">
                  <option value="">No style</option>
                  <option value="primary">primary</option>
                  <option value="link">link</option>
                  <option value="info">info</option>
                  <option value="success">success</option>
                  <option value="warning">warning</option>
                  <option value="danger">danger</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Timeout: <small>{{timeout}}</small></label>
            <div class="control is-expanded">
              <input type="range" step="1" min="100" max="100000" v-model="timeout" style="width:100%">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input type="submit" class="button is-link" value="Notify">
            </div>
          </div>
        </form>
      </section>
    </div>`,
  }));
