import {writable, type Writable} from "svelte/store";

const step: Writable<number> = writable(0);
const theme: Writable<'light' | 'dark'> = writable('light');

const level: Writable<0 | 1 | 2> = writable(0);
const score: Writable<number> = writable(0);

const pause: Writable<boolean> = writable(false);
const preStar: Writable<boolean> = writable(false);

export {step, theme, level, score, pause, preStar};