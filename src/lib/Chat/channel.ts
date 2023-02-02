import { writable, type Writable } from "svelte/store";
import { Nick } from "./nick";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export class Channel {
    members: Nick[] = [];

    nicks: Nick[] = [];
    nicks_live: Writable<Nick[]>;
    nicks_subscription?: string;

    constructor(private conn: IrcConnection, public name: string) {
        this.nicks_live = writable();
    }

    join() {
        this.conn.join_channel(this.name);
        this.nicks_subscription = this.conn.task_queue.subscribe(
            this.process_names,
            {
                only: { command: "353", params: ["*", "*", this.name] },
                until: { command: "366", params: ["*", this.name] }
            }
        );
    }

    privmsg(msg: string) {
        this.conn.privmsg(this.name, msg);
    }

    private process_names(data: IrcMessageEvent) {
        const param = data.params.last();
        const names_split = param.split(" ");
        const nicks = names_split.map(o => new Nick(o));
        this.nicks = nicks;
        // this.nicks_live.set(this.nicks);
    }   
}