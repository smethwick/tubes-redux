import { MessageGroup } from "$lib/Chat/groups";
import { MessageTypes, type Message } from "$lib/Storage/messages";
import type { SvelteComponent } from "svelte";
import DateMarker from "./DateMarker.svelte";

export class NotAMessage<T> {
    comp: typeof SvelteComponent;
    params?: T;

    constructor(comp: typeof SvelteComponent, params?: T) {
        this.comp = comp;
        this.params = params;
    }
}

const groupable_types = [
    MessageTypes.Join, 
    MessageTypes.Quit, 
    MessageTypes.Part
];

export const isAGroup = <T>(input: Message | MessageGroup | NotAMessage<T>): input is MessageGroup => {
    // eslint-disable-next-line no-prototype-builtins
    if (input.hasOwnProperty('messages')) return true;
    else return false;
};

export const isntAMessage = <T>(input: Message | MessageGroup | NotAMessage<T>)
    : input is NotAMessage<T> => 
    {
        // eslint-disable-next-line no-prototype-builtins
        if (input.hasOwnProperty('comp')) return true;
        else return false;
    }

export const group = (msgs: Message[], prev?: Message) => {
    const grouped: (Message | MessageGroup | NotAMessage<unknown>)[] = [];

    msgs.forEach((o) => {
        const last_elem = prev ?? grouped.at(grouped.length - 1);
        if (
            last_elem 
            && !isAGroup(last_elem) 
            && !isntAMessage(last_elem)
            && o.timestamp.getDay() > last_elem.timestamp.getDay()
        ) {
            grouped.push(new NotAMessage<Date>(DateMarker, o.timestamp));
        }
        if (groupable_types.includes(o.type)) {
            if (last_elem && isAGroup(last_elem)) last_elem.add(o);
            else grouped.push(new MessageGroup([o]));
        }
        else grouped.push(o);
    });

    return grouped;
}
