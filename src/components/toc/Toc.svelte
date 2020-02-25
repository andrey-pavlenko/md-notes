<script>
  import { loading as tocLoading, assets as tocAssets } from '../../store/toc';
  import TocItem from './TocItem.svelte';
</script>

<div id="table-of-contents">
  {#if $tocLoading}
  <div class="wait-box is-size-4 has-text-grey-light has-text-centered">Выполняется загрузка содержания...</div>
  {:else}
  <ul>
    {#each $tocAssets as item (item.path)}
    <li>
      <TocItem {item}/>
    </li>
    {/each}
  </ul>
  {/if}
</div>