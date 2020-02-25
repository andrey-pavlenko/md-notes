import Help from './Help.svelte';
import Toc from '../toc/Toc.svelte';
import Note from '../Note.svelte';
import Search from './Search.svelte';
import Tag from './Tag.svelte';
import Tags from './Tags.svelte';

const routes = {
  '/': Toc,
  '/help': Help,
  '/search': Search,
  '/tag/:name': Tag,
  '/tags': Tags,
  '/*': Note
};

export { routes };
