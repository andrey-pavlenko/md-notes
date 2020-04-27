// @ts-nocheck
import Help from './help/Help.svelte';
import Toc from './toc/Toc.svelte';
import Note from './Note.svelte';
import Search from './Search.svelte';
import Tag from './tags/TagNotes.svelte';
// @ts-check

const routes = {
  '/': Toc,
  '/help': Help,
  '/search': Search,
  '/tag/:tag': Tag,
  '/*': Note
};

export { routes };
