<script>
  import { createEventDispatcher } from 'svelte';
  import { keydownWatcher } from '../modules/keyboard-watcher';

  export let src = undefined;
  export let alt = 'Просмотр изображения';

  let zoomIn = false;

  const isTouchScreen = 
    'ontouchstart' in window ||
    window.navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;

  const keydownMap = {
    ['Esc']: closeModal
  };

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('image-zoomer:close');
  }

  function focusModal(node) {
    node.focus();
  }
</script>

{#if src != null}
<div
  class="image-zoomer modal is-active"
  tabindex="-1"
  use:keydownWatcher={keydownMap}
  use:focusModal
>
  <div class="modal-background" on:click="{closeModal}"></div>
  <label class="modal-content">
    <input type="checkbox" bind:checked="{zoomIn}">
    <img {src} {alt}>
  </label>
  <button class="modal-close is-large" on:click="{closeModal}"></button>
  {#if isTouchScreen}
  <span class="zoom-icon" on:click={() => zoomIn = !zoomIn}>
    <svg class="icon">
    <use href="{'icons.svg#zoom-' + (zoomIn ? 'in' : 'out')}" />
    </svg>
  </span>
  {/if}
</div>
{/if}