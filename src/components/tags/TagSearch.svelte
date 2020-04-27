<script>
  import { push } from 'svelte-spa-router';
  import { assets as tagAssets } from '../../store/tags';
  import TagsList from './TagsList.svelte';

  let pattern = '';

  function useInput(node) {
    function handleKeydown(event) {
      switch (event.key) {
        case 'Escape':
          pattern = '';
          break;
        case 'Enter':
          if ($tagAssets[event.target.value] > 0) {
            push('/tag/' + event.target.value);
          }
          break;
      }
    }

    node.addEventListener('keydown', handleKeydown);

    return {
      destroy() {
        node.removeEventListener('keydown', handleKeydown);
      }
    };
  }

</script>
<div class="tags-with-filter">
  <input
    class="input is-small"
    type="text"
    placeholder="Фильтр тэгов"
    bind:value="{pattern}"
    use:useInput
  >
  <TagsList bind:pattern="{pattern}"/>
</div>