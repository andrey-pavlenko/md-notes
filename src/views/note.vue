<template lang="pug">
.view-note
  Spinner(v-if="processing")
  .columns(v-else)
      .column.is-four-fifths
        .content.markdown(v-html="html", ref="markdown")
      .column.view-note_tags
        hr.is-hidden-tablet
        TagsContainer(v-if="tags.length", :tags="tags")
      ImgPreview(v-if="imgPreviewSrc", :src="imgPreviewSrc", @close="imgPreviewSrc=''")
</template>

<script>
import debounce from 'lodash/debounce';
import { mapState, mapActions, mapGetters } from 'vuex';
import Spinner from '@/components/spinner';
import TagsContainer from '@/components/tags/tags-container';
import ImgPreview from '@/components/img-preview';

export default {
  components: {
    Spinner,
    TagsContainer,
    ImgPreview
  },
  props: {
    url: String
  },
  data() {
    return {
      imgPreviewSrc: ''
    };
  },
  computed: {
    tags: function() {
      const note = this.noteByUrl(this.url);
      const tags = this.noteTags(note);
      return tags;
    },
    ...mapState({ processing: 'processing' }),
    ...mapGetters({ noteByUrl: 'noteByUrl', noteTags: 'noteTags' })
  },
  methods: {
    onWindowResize: debounce(function() {
      this.updateImgPreviewAll();
    }, 500),
    onImgPreview(event) {
      this.imgPreviewSrc = event.target.src;
    },
    updateImgPreview(img) {
      if (img.naturalWidth > img.width || img.naturalHeight > img.height) {
        img.classList.add('img-zoomable');
        img.onclick = this.onImgPreview;
      } else {
        img.classList.remove('img-zoomable');
        img.onclick = null;
      }
    },
    updateImgPreviewAll() {
      this.$refs['markdown'].querySelectorAll('img').forEach(i => {
        if (i.complete) {
          this.updateImgPreview(i);
        } else {
          i.onload = event => {
            event.target.onload = null;
            this.updateImgPreview(event.target);
          };
        }
      });
    },
    ...mapActions({ getHtml: 'getHtml' })
  },
  asyncComputed: {
    async html() {
      return this.processing ? '' : await this.getHtml(this.url);
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.onWindowResize);
    });
  },
  updated() {
    this.$nextTick(function() {
      this.updateImgPreviewAll();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>
