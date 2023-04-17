import { turnIntoSomethingUseful, type Message } from "$lib/Storage/messages";
import { writable, type Writable } from "svelte/store";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

// This is expected to change when the chathistory extensions
// stops being a draft
const CAP_NAME = "draft/chathistory";

type C_Timestamp = ["timestamp", Date] | ["msg_id", string];

// TODO: this sucks LMAO
export class MessageLogList {
    store: Writable<Message[]>;
    /** whether the logs have been initialised yet */
    opened = false;
    /** true if the user is looking at the conversation */
    active = false;
    unread = 0;
    unread_live = writable(0);

    constructor(private conn: IrcConnection, public messages: Message[]) {
        this.store = writable(messages);
    }

    async open() {
        this.unread = 0;
        this.unread_live.set(this.unread);
        this.active = true;
        this.opened = true;
    }

    async deactivate() {
        this.active = false;
    }

    static async fromIdxDb() {
        //
    }

    private static async fetch_chat_history(
        conn: IrcConnection,
        target: string,
        before?: C_Timestamp,
        limit = 100
    ) {
        if (!conn.capman.hasCap(CAP_NAME))
            throw new Error("This connection doesn't support chathistory");

        if (!before) {
            conn.send_raw(`CHATHISTORY LATEST ${target} * ${limit}`);
        } else {
            const stamp = before[0] == "timestamp" ? before[1].toISOString() : before[1];
            console.log(stamp);
            conn.send_raw(`CHATHISTORY BEFORE ${target} timestamp=${stamp} ${limit}`);
        }

        const messages = await conn.task_queue.collect_batch(`chathistory ${target}`);

        const result: Message[] = [];

        messages.forEach(async e => {
            const msg = await turnIntoSomethingUseful(conn.connection_info.name, e)
            msg ? result.push(msg) : null;
        });

        return result;
    }

    static async fromChatHistory(
        conn: IrcConnection,
        target: string,
        before?: C_Timestamp,
        limit = 100
    ): Promise<MessageLogList> {
        const messages = await this.fetch_chat_history(conn, target, before, limit);

        return new MessageLogList(conn, messages);
    }

    async load_more(
        conn: IrcConnection,
        target: string,
        before?: C_Timestamp,
        limit = 100
    ) {
        const response = await MessageLogList.fetch_chat_history(conn, target, before, limit);
        console.log(response);

        if (!this.opened) return;
        this.messages = response.concat(this.messages);
        console.log(this.messages);
        this.store.set(this.messages);
    }

    async push(data: Message) {
        // hack to get the thing to exclude subsequent chathistory responses.
        // FIXME: this will break things in the future!!
        const tag = data.origin?.tags?.find(o => o.key == "batch");
        if (tag) return;

        if (!this.active && !["join", "part", "quit"].includes(data.command.toLocaleLowerCase())) {
            this.unread = this.unread + 1;
            this.unread_live.set(this.unread);
        }

        if (!this.opened) return;

        this.messages = [...this.messages, data];
        this.store.set(this.messages);
    }
}