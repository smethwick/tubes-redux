import type { IrcConnection, RawIrcMessage } from "./provider+connection";

export type ListEntry = [channel: string, client_count: number, topic: string]

export class ChannelCollector {
    static async get_channels(conn: IrcConnection): Promise<ListEntry[]> {
        conn.send_raw("LIST");
        const msgs = await conn.task_queue.collect(
            // RPL_LIST
            { command: "322" },
            // RPL_LIST
            [{ command: "322" }],
            // RPL_LISTEND
            { command: "323" },
            { include_start_and_finish: true }
        );

        const result: ListEntry[] = [];
        msgs.forEach(msg => {
            const res = this._parse_input(msg);
            if (res) result.push(res);
        });

        return result;
    }

    static _parse_input(msg: RawIrcMessage): ListEntry | undefined {
        const [channel, count, topic] = msg.params.slice(1);
        const client_count = Number(count);
        if (!channel || !client_count || !topic) return;

        return ([channel, client_count, topic]);
    }
}