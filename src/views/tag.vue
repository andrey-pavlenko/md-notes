<template lang="pug">
  ul
    li(v-for="note in notesByTag(label)")
      router-link(:to="note.url") {{note.meta.title}}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      notesByTag: 'notesByTag'
    })
  }
};
</script>
