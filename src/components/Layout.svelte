<script>
  import Router from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { routes } from './routes';
  import { loading as loadingRepository } from '../store/repository';

  const activeClass = 'is-active';

  /**
   * @type {HTMLElement}
   */
  let menuElement = undefined;

  /**
   * @param {HTMLElement} node
   */
  function burgerMenuToggle(node) {
    /**
     * @param {MouseEvent | KeyboardEvent} event
     */
    function closeMenu(event) {
      function close() {
        node.classList.remove(activeClass);
        if (menuElement) {
          menuElement.classList.remove(activeClass);
        }
        document.removeEventListener('click', closeMenu);
        document.removeEventListener('keydown', closeMenu);
      }

      if (event.type === 'click') {
        close();
      } else if (event.type === 'keydown') {
         if (event.key === 'Escape') {
           close();
         } else if (event.key === 'Tab') {
           if (!menuElement || !menuElement.contains(event.srcElement)) {
             close();
           }
         }

      }
    }

    function onBurgerClick() {
      node.classList.toggle(activeClass);
      if (menuElement) {
        menuElement.classList.toggle(activeClass);
      }
      setTimeout(() => {
        if (node.classList.contains(activeClass)) {
          document.addEventListener('click', closeMenu);
          document.addEventListener('keydown', closeMenu);
        }
      }, 0);
    }

    node.addEventListener('click', onBurgerClick);
    return {
      destroy() {
        if (node.classList.contains(activeClass)) {
          document.removeEventListener('click', closeMenu);
          document.removeEventListener('keydown', closeMenu);
        }
        node.removeEventListener('click', onBurgerClick);
      }
    };
  }
</script>

<nav class="navbar is-primary is-fixed-top" id="layout-navbar">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item" href="#/">
        {#if $loadingRepository}
        <span class="is-size-4 spinner"></span>
        {:else}
        <svg class="icon"><use href="icons.svg#note"></use></svg>
        {/if}
        &nbsp;
        <span class="has-text-weight-bold is-size-4">Notes</span>
      </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="navbar-burger burger" use:burgerMenuToggle="{menuElement}">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" bind:this="{menuElement}">
      <div class="navbar-start">
        <a class="navbar-item" href="#/" use:active="{{className: activeClass}}">Содержание</a>
        <a class="navbar-item" href="#/tags" use:active="{{className: activeClass}}">Тэги</a>
        <a class="navbar-item" href="#/search" use:active="{{className: activeClass}}">Поиск</a>
      </div>
      <div class="navbar-end">
        <a class="navbar-item" href="#/help" use:active="{{className: activeClass}}">Помощь</a>
      </div>
    </div>
  </div>
</nav>
<div class="container" id="layout-body">
  <Router {routes} />
</div>