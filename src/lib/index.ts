import {writable, type Writable} from "svelte/store";

const step: Writable<number> = writable(0);
const theme: Writable<'light' | 'dark'> = writable('light');

const level: Writable<0 | 1 | 2> = writable(0);

export {step, theme, level};