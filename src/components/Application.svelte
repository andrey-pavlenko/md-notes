<script>
  import Layout from './Layout.svelte';
  import { init as repositoryInit } from '../store/repository';

  repositoryInit();
</script>

<Layout />