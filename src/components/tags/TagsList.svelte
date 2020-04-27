<script>
  import TagItem from './TagItem.svelte';
  import { assets as tagAssets } from '../../store/tags';
  
  export let pattern = undefined;
  export let tags = undefined;

  $: showTags = filterTags(Array.isArray(tags) ? tags : Object.keys($tagAssets), pattern);

  function filterTags(tags, filter) {
    let _tags;
    if (filter) {
      filter = filter.toLocaleLowerCase();
      _tags = tags.filter(tag => tag.toLocaleLowerCase().includes(filter));
    } else {
      _tags = tags;
    }
    return _tags
      .map(tag => {
          const count = $tagAssets[tag];
          if (count && count > 0) {
            return {
              title: tag,
              count
            };
          }
        })
      .filter(tag => tag != null)
      .sort((a, b) => b.count - a.count);
  }
</script>

{#if showTags.length}
<div class="tags-list">
  {#each showTags as item (item.title)}
  <a href="#/tag/{encodeURIComponent(item.title)}"><TagItem {...item} /></a>
  {/each}
</div>
{/if}