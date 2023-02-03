import type { Writable } from "svelte/store"
import { default_config, default_icons, type IrcConnection } from "./provider+connection";
import { LocalProvider } from "./Providers/local";
import { SingleConnectionProvider } from "./Providers/single";

export const provider = new LocalProvider();

// export const provider = new SingleConnectionProvider({
//     ...default_config,
//     name: 'ergo-testnet',
//     display_name: 'Ergo Testnet',
//     icon: default_icons[Math.floor(Math.random() * default_icons.length)],
//     url: 'wss://testnet.ergo.chat/webirc',
//     autojoin: ['#tubes', '#tubes/test', '#testaaaa']
// });

// export let active_connection: Writable<IrcConnection>;