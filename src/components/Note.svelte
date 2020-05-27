<script>
  import { beforeUpdate, afterUpdate, onDestroy } from 'svelte';
  import { location } from 'svelte-spa-router';
  import { assets } from '../store/repository';
  import ImageZoomer from './ImageZoomer.svelte';
  import TagsList from './tags/TagsList.svelte';

  let note = undefined;
  let markdownElement = undefined;
  let zoomImageSrc = undefined;
  let zoomImageAlt = undefined;
  let relatedNotes = undefined;
  let noteTags = undefined;

  $: (function(assets, location) {
      note = assets.findNote('path', decodeURI(location).replace(/^[/.]*/, ''));
      noteTags = note && note.tags;
      if (note && note.related != null) {
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
    } else {
      img.classList.remove('img-zoomable');
      img.onclick = null;
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

  beforeUpdate(removeImgsZoomer);
  afterUpdate(updateImgsZoomer);
  onDestroy(removeImgsZoomer);

</script>

<svelte:window on:resize="{updateImgsZoomer}" />
<ImageZoomer
  src="{zoomImageSrc}"
  alt="{zoomImageAlt}"
  on:image-zoomer:close="{() => {
  zoomImageSrc = undefined;
}}" />
{#if note != null}
<div class="columns">
  <div 
    class="column content markdown" 
    class:is-four-fifths="{relatedNotes != null || noteTags != null}" 
    bind:this="{markdownElement}"
  >{@html note.html}</div>
  {#if relatedNotes != null || noteTags != null}
    <div class="column">
    {#if relatedNotes != null}
      <div class="note-related">
        <div class="is-size-7">Связанные темы:</div>
        <ul>
          {#each relatedNotes as relateNote (relateNote.path)}
          <li><a href="#/{relateNote.path}">{relateNote.title}</a></li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if noteTags != null}
    <div class="note-tags">
      <div class="is-size-7">Тэги:</div>
      <TagsList tags="{noteTags}" />
    </div>
    {/if}
    </div>
  {/if}
</div>
{:else}
<div>Not found</div>
{/if}