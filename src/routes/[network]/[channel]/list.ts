import { tick } from "svelte";

export const scrollToBottom = (node: Element, list: Array<unknown>) => {
    const scroll = async (_: Array<unknown>) => await tick();
    node.scroll({
        top: node.scrollHeight,
        behavior: 'smooth'
    });
    scroll(list);

    return { update: scroll };
};

export const on_mount = async (div: Element) => {
    await tick();

    div.scroll({
        top: div.scrollHeight
    });
}