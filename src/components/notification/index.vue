<template lang="pug">
  .notification-area
    NotificationItem(
      v-for="item in items"
      :key="item.timestamp"
      :params="item"
      @remove="remove")
</template>

<script>
let instance = null;

const DELAY_NORMAL = 2500;
const DELAY_WARNING = 10000;
const DELAY_ERROR = 30000;

import NotificationItem from './item';

export default {
  components: {
    NotificationItem
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    add(params) {
      if (params.message) {
        params.timestamp = new Date().getTime();
        this.items = [...this.items, params];
      }
    },
    remove(params) {
      const index = this.items.indexOf(params);
       if (index >= 0) {
        this.items = [...this.items.slice(0, index), ...this.items.slice(index + 1)];
      } else {
        this.items = this.items.filter((item) => item.timestamp !== params.timestamp);
      }
    },
    clear() {
      this.item = [];
    }
  },
  mounted() {
    instance = this;
  }
}

function notify(params) {
  if (instance && instance.add) {
    const { style, header, message, timeout} = params;
    instance.add({
      style,
      header,
      message,
      timeout
    });
  }
}

export { DELAY_NORMAL, DELAY_WARNING, DELAY_ERROR, notify };
</script>