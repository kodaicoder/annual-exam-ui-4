import { writable } from 'svelte/store';

// Create a writable store with initial value as false
export const filterStore = writable(null);
