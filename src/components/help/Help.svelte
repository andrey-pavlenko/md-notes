<script>
  import Pako from 'pako';
  import { toHtml } from '../../modules/marked.js';

  function decompress(str) {
    const decoder = new TextDecoder();
    return decoder.decode(Pako.inflate(atob(str)));
  }

  const helpMd = toHtml(decompress('__help_md__'));
</script>

<div class="content markdown">{@html helpMd}</div>