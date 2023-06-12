import { MessageGroup } from "$lib/Chat/groups";
import type { conn_styles } from "$lib/Chat/provider+connection";
import { MessageTypes, type Message } from "$lib/Storage/messages";
import DateMarker from "./DateMarker.svelte";
import type { ComponentType, SvelteComponentTyped } from "svelte";
import { z } from "zod";

/**
 * a class for putting svelte components in the message stream.
 */
export class ComponentAdapter<T> {
    comp: ComponentType<SvelteComponentTyped<{ params?: T, style?: conn_styles }>>;
    params?: T;

    constructor(comp: ComponentType, params?: T) {
        this.comp = comp;
        this.params = params;
    }
}

export const comp_adapter_schema = z.instanceof(ComponentAdapter);
export const message_group_schema = z.instanceof(MessageGroup);
const message_schema = z.object({
    network: z.string(),
    command: z.string(),
    type: z.nativeEnum(MessageTypes),
}).passthrough();

// the message types we want to be grouped together
const groupable_types = [
    MessageTypes.Join,
    MessageTypes.Quit,
    MessageTypes.Part
];

// types that could be in the list
export type CondensedTypes<T> = Message | MessageGroup | ComponentAdapter<T> | undefined;

export function condense(messages: Message[]) {
    let grouped: CondensedTypes<unknown>[] = [];

    for (const e of messages) {
        const previous = grouped.at(-1);

        // If the previous item was a component adapter,
        // just add the message as normal
        if (comp_adapter_schema.safeParse(previous).success) {
            grouped.push(e);
            break;
        }

        // if the previous item is a group and the message is
        // groupable, add it to the group.
        const group = message_group_schema.safeParse(previous);
        if (group.success && groupable_types.includes(e.type)) {
            const previous_timestamp = group.data.messages.at(-1)?.timestamp.getDay();
            const current_timestamp = e.timestamp.getDay();
            if (previous_timestamp && (previous_timestamp < current_timestamp)) {
                grouped.push(new ComponentAdapter<Date>(DateMarker, e.timestamp));
                grouped.push(e);
                break;
            }
            group.data.add(e);
            break;
        }

        if (groupable_types.includes(e.type) && groupable_types.includes(previous?.type)) {
            const group = new MessageGroup([previous, e]);
            grouped.push(group);
            break;
        }

        grouped.push(e)
    }

    return grouped
}