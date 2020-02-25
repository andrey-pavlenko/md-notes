import './styles/style.scss';
import Application from './components/Application.svelte';
// import { initRemoteRepository } from './store';

// initRemoteRepository();

const app = new Application({
  target: document.body
});

export default app;
