<script>
  import { assets as repositoryAssets } from '../../store/repository';
  
  export let params = undefined;

  $: notes = ($repositoryAssets != null && params.tag != null) ? 
    $repositoryAssets.findNotesByTag(params.tag) :
    undefined;

</script>
<div>
  <div class="is-pulled-right" style="margin: 0 0 1em 1em"><span class="tag is-link is-medium">{params.tag}</span></div>
  <div class="content">
    {#if notes.length > 0}
    <ul>
      {#each notes as note (note.path)}
      <li><a href="#/{note.path}">{note.title}</a></li>
      {/each}
    </ul>
    {:else}
    <div>Not found</div>
    {/if}
  </div>
</div>