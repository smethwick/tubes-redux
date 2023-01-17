import { writable } from "svelte/store"
import { LocalProvider } from "./Providers/local";

export let provider = writable(new LocalProvider);