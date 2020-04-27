<script>
  import { loading as tocLoading, assets as tocAssets } from '../../store/toc';
  import { empty as tagsEmpty } from '../../store/tags';
  import TocItem from './TocItem.svelte';
  import TagSearch from '../tags/TagSearch.svelte';

</script>

<div id="table-of-contents">
  {#if $tocLoading}
  <div class="wait-box is-size-4 has-text-grey-light has-text-centered">Выполняется загрузка содержания...</div>
  {:else}
  <div class="columns">
    <div id="table-of-contents_body" class="column content">
      <ul>
        {#each $tocAssets as item (item.path)}
        <li>
          <TocItem {item}/>
        </li>
        {/each}
      </ul>
    </div>
    {#if !$tagsEmpty}
    <div class="column is-one-third extra-column"><TagSearch /></div>
    {/if}
  </div>
  {/if}
</div>