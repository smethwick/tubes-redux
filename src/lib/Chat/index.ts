import type { Writable } from "svelte/store"
import type { IrcConnection } from "./provider+connection";
import { LocalProvider } from "./Providers/local";

export const provider = new LocalProvider;

export let active_connection: Writable<IrcConnection>;