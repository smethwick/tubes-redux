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

// taken from https://stackoverflow.com/a/7493982
// thank you
export function pick_deterministic<T>(arr: Array<T>, seed: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore i'm so tired. i know this works.
    const charCodes: number = seed.split('').reduce(function (a, b, i): number {
        return (i == 1 ? a.charCodeAt(0) : +a) + b.charCodeAt(0);
    });
    return arr[charCodes % arr.length]
}