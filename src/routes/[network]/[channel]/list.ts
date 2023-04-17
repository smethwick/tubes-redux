import type { Channel } from "$lib/Chat/channel";
import { tick } from "svelte";
import { writable, type Writable } from "svelte/store";

export let messagelist: Writable<Element | undefined> = writable();

export const scrollToBottom = (node: Element, aaaa: {list: Array<unknown>, channel: Channel}) => {
    const scroll = async (_: Array<unknown>) => {
        if (!aaaa.channel.session?.active) return;
        await tick();
        node.scroll({
            top: node.scrollHeight,
            behavior: 'auto'
        });
    }
    scroll(aaaa.list);

    return { update: scroll };
};

export const on_mount = async (div: Element, channel: Channel) => {
    await tick();

    messagelist.set(div);

    div.scroll({
        top: div.scrollHeight
    });
}