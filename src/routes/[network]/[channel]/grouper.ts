import { MessageGroup } from "$lib/Chat/groups";
import { MessageTypes, type Message } from "$lib/Storage/messages";
import type { SvelteComponent } from "svelte";
import DateMarker from "./DateMarker.svelte";

export class ComponentAdapter<T> {
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

type TypesItCouldBe<T> = Message | MessageGroup | ComponentAdapter<T> | undefined;

export const isAMessage = <T>(input: TypesItCouldBe<T>): input is Message => {
    // eslint-disable-next-line no-prototype-builtins
    if (input?.hasOwnProperty('timestamp')) return true;
    else return false;
}

export const isAGroup = <T>(input: TypesItCouldBe<T>): input is MessageGroup => {
    // eslint-disable-next-line no-prototype-builtins
    if (input?.hasOwnProperty('messages')) return true;
    else return false;
};

export const isAComponent = <T>(input: TypesItCouldBe<T>): input is ComponentAdapter<T> => {
    // fucking sue me
    // eslint-disable-next-line no-prototype-builtins
    if (input?.hasOwnProperty('comp')) return true;
    else return false;
}

export const group = (msgs: Message[], prev?: Message) => {
    const grouped: (Message | MessageGroup | ComponentAdapter<unknown>)[] = [];

    // TODO: this really feels like it needs a more streamlined implementation
    msgs.forEach((o) => {
        let last_elem = prev ?? grouped.at(-1);

        // get the latest message if it's a group
        let last_message: Message | undefined;
        if (isAGroup(last_elem) && !isAComponent(last_elem))
            last_message = last_elem.messages.at(-1)!;
        else if (isAMessage(last_elem)) last_message = last_elem;

        // if the messages on different days, pop a timestamp in
        if (
            last_message
            && o.timestamp.getDay() > last_message.timestamp.getDay()
        ) {
            grouped.push(new ComponentAdapter<Date>(DateMarker, o.timestamp));
        }

        // if the last element can be grouped and the last element was a
        // group, add it to the group.
        if (groupable_types.includes(o.type)) {
            if (last_elem && isAGroup(last_elem)) last_elem.add(o);
            else grouped.push(new MessageGroup([o]));
        }
        // otherwise just add it without any bells or whistles.
        else grouped.push(o);
    });

    return grouped;
}
