<script>
  export let item = undefined;

  // console.info(item);
</script>

<a href="#/{item.path}">{item.title}</a>
{#if item.children && item.children.length}
<ul>
  {#each item.children as child (child.path)}
  <li>
    <svelte:self item="{child}"/>
  </li>
  {/each}
</ul>
{/if}