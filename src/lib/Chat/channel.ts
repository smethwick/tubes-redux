import { writable, type Writable } from "svelte/store";
import { Nick } from "./nick";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export class Channel {
    members: Nick[] = [];

    nicks: Nick[];
    nicks_live: Writable<Nick[]>;
    nicks_subscription?: string;

    joined: boolean = false;

    constructor(private conn: IrcConnection, public name: string) {
        this.nicks_live = writable([]);
        this.nicks = [];
        console.log("here", this.nicks_live)
    }

    join() {
        this.conn.send_raw("JOIN " + this.name);
        console.log("here");
        this.nicks_subscription = this.conn.task_queue.subscribe(
            d => this.process_names(d),
            {
                only: { command: "353", params: ["*", "*", this.name] },
                until: { command: "366", params: ["*", this.name] }
            }
        );

        this.joined = true;
    }

    privmsg(msg: string) {
        this.conn.privmsg(this.name, msg);
    }

    process_names(data: IrcMessageEvent) {
        const param = data.params.last();
        const names_split = param.split(" ");
        const nicks = names_split.map(o =>  new Nick(o));
        this.nicks = [ ...this.nicks, ...nicks ];
        this.nicks_live.set(this.nicks);
    }   
}