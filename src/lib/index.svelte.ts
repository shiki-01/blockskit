import {writable, type Writable} from "svelte/store";

const step: Writable<number> = $state(writable(0));
const theme: Writable<'light' | 'dark'> = $state(writable('light'));

const level: Writable<0 | 1 | 2> = $state(writable(0));
const score: Writable<number> = $state(writable(0));

const pause: Writable<boolean> = $state(writable(false));
const preStar: Writable<boolean> = $state(writable(false));

export {step, theme, level, score, pause, preStar};