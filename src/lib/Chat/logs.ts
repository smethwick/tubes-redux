import { turnIntoSomethingUseful, type Message } from "$lib/Storage/messages";
import { writable, type Writable } from "svelte/store";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

// This is expected to change when the chathistory extensions
// stops being a draft
const CAP_NAME = "draft/chathistory";

type C_Timestamp = ["timestamp", Date] | ["msg_id", string];
export class MessageLogList {
    store: Writable<Message[]>;
    opened = false;

    constructor(private conn: IrcConnection, public messages: Message[]) {
        this.store = writable(messages);
    }

    async open() {
        this.opened = true;
    }

    static async fromIdxDb() {
        //
    }

    static async fromChatHistory(
        conn: IrcConnection,
        target: string,
        before?: C_Timestamp,
        limit = 100
    ): Promise<MessageLogList> {
        if (!conn.capman.hasCap(CAP_NAME))
            throw new Error("This connection doesn't support chathistory");

        if (!before) {
            conn.send_raw(`CHATHISTORY LATEST ${target} * ${limit}`);
        } else {
            conn.send_raw(`CHATHISTORY BEFORE ${target} ${before[1]} ${limit}`);
        }

        const messages = await conn.task_queue.collect_batch(`chathistory ${target}`);

        const result: Message[] = [];

        messages.forEach(async e => {
            const msg = await turnIntoSomethingUseful(conn.connection_info.name, e)
            msg ? result.push(msg) : null;
        });

        return new MessageLogList(conn, result);
    }

    async push(data: Message) {
        if (!this.opened) return;
        this.messages = [...this.messages, data];
        this.store.set(this.messages);
    }
}