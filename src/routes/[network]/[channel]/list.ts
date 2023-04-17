import type { Channel } from "$lib/Chat/channel";
import { tick } from "svelte";
import { writable, type Writable } from "svelte/store";

export const scrollToBottom = (
    node: Element, 
    // had a svelte moment here, sorry
    aaaa: { list: Array<unknown>, channel: Channel }
    ) => {
    const scroll = async (_: Array<unknown>) => {
        // if the user isn't following the conversation, don't bother scrolling down.
        if (!aaaa.channel.session?.active) return;

        // svelte moment
        await tick();

        // scroll to the bottom
        node.scroll({
            top: node.scrollHeight,
            behavior: 'auto'
        });
    }
    // this'll rerun when aaaa.list updates (i.e. when a new message comes in)
    scroll(aaaa.list);

    return { update: scroll };
};

export const on_mount = async (div: Element, channel: Channel) => {
    await tick();

    div.scroll({
        top: div.scrollHeight
    });
}