import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export type ListEntry = [channel: string, client_count: number, topic: string]

export class ChannelList extends Array<ListEntry> {
    constructor(private conn: IrcConnection) { super() }

    async get_channels(): Promise<this> {
        this.conn.send_raw("LIST");
        this.conn.task_queue.subscribe((msg) => this._process_input(msg), {
            only: { command: "322" },
            until: { command: "323" }
        })
        await this.conn.task_queue.wait_for({ command: "323" });
        return this;
    }

    private _process_input(msg: IrcMessageEvent) {
        const [channel, count, topic] = msg.params.slice(1);
        const client_count = Number(count);
        if (!channel || !client_count || !topic) return;

        this.push([channel, client_count, topic]);
    }
}