import { MessageTypes, type Message } from "$lib/Storage/messages";

export class MessageGroup {
    constructor(public messages: Message[]) {}

    add(msg: Message) {
        this.messages.push(msg);
    }

    summarise(): string {
        let joins = 0, parts = 0, quits = 0;

        this.messages.forEach(o => {
            if (o.type == MessageTypes.Join) joins++
            if (o.type == MessageTypes.Part) parts++
            if (o.type == MessageTypes.Quit) quits++
        })

        const res = [];

        if (joins) res.push(`${joins} ${joins == 1 ? "person" : "people"} joined`);
        if (parts) res.push(`${parts} ${parts == 1 ? "person" : "people"} left`);
        if (quits) res.push(`${quits} ${quits == 1 ? "person" : "people"} quit`);

        return res.join(", ");
    }
}