// @ts-ignore
import { writable } from 'svelte/store';

const pattern = writable('');
const found = writable([]);

export { pattern, found };