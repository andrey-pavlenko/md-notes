<script>
  import { beforeUpdate, afterUpdate, onDestroy } from 'svelte';
  import { location } from 'svelte-spa-router';
  import { assets } from '../store/repository';
  import ImageZoomer from './ImageZoomer.svelte';

  let note = undefined;
  let markdownElement = undefined;
  let zoomImageSrc = undefined;
  let zoomImageAlt = undefined;
  let relatedNotes = undefined;

  $: (function(assets, location) {
      note = assets.findNote('path', decodeURI(location).replace(/^[/.]*/, ''));
      console.info(note.tags);
      console.info(note.related);
      console.info(assets);
      if (note.related != null) {
        relatedNotes = note.related
          .map(relatePath => assets.findNote('path', relatePath))
          .filter(note => note != null);
      }
    })($assets, $location);
  
  function zoomImage() {
    zoomImageSrc = this.src;
    zoomImageAlt = this.alt;
  }

  function updateImgZoomer(img) {
    if (img.naturalWidth > img.width || img.naturalHeight > img.height) {
      img.classList.add('img-zoomable');
      img.onclick = zoomImage;
      // console.info('Добавить к', img);
    } else {
      img.classList.remove('img-zoomable');
      img.onclick = null;
      // console.info('Удалить из', img);
    }

  }

  function updateImgsZoomer() {
    if (markdownElement != null) {
      markdownElement.querySelectorAll('img').forEach(img => {
        if (img.complete) {
          updateImgZoomer(img);
        } else {
          img.onload = event => {
            updateImgZoomer(event.target);
            event.target.onload = null;
          };
        }
      });
    }
  }

  function removeImgsZoomer() {
    if (markdownElement != null) {
      markdownElement.querySelectorAll('img').forEach(img => img.onclick = null);
    }
  }

  function noteCreated(node) {
    markdownElement = node;
  }

  beforeUpdate(removeImgsZoomer);
  afterUpdate(updateImgsZoomer);
  onDestroy(removeImgsZoomer);

</script>

<svelte:window on:resize="{updateImgsZoomer}" />
<ImageZoomer src="{zoomImageSrc}" alt="{zoomImageAlt}" on:image-zoomer:close="{() => {
  zoomImageSrc = undefined;
}}" />
{#if note != null}
<div class="columns">
  <div class="column content markdown" class:is-four-fifths="{relatedNotes != null}" use:noteCreated>{@html note.html}</div>
  {#if relatedNotes != null}
  <div class="column">
    <div class="is-size-7">Связанные темы:</div>
    <ul>
      {#each relatedNotes as relateNote (relateNote.path)}
      <li><a href="#/{relateNote.path}">{relateNote.title}</a></li>
      {/each}
    </ul>
  </div>
  {/if}
</div>
{:else}
<div>Not found</div>
{/if}