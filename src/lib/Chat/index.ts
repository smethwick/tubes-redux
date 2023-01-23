import { writable } from "svelte/store"
import { LocalProvider } from "./Providers/local";

export const provider = writable(new LocalProvider);