import { writable, type Writable } from "svelte/store";
import { Nick } from "./nick";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export class Channel {
    members: Nick[] = [];

    nicks: Nick[];
    nicks_live: Writable<Nick[]>;
    nicks_subscription?: string;
    join_subscription?: string;
    part_subscription?: string;

    joined = false;

    constructor(private conn: IrcConnection, public name: string) {
        this.nicks_live = writable([]);
        this.nicks = [];
    }

    async join() {
        this.conn.send_raw("JOIN " + this.name);
        
        this.nicks_subscription = this.conn.task_queue.subscribe(
            d => this.process_names(d),
            {
                only: { command: "353", params: ["*", "*", this.name] },
                until: { command: "366", params: ["*", this.name] }
            }
        );

        await this.conn.task_queue.wait_for( { command: "366", params: ["*", this.name] });

        this.join_subscription = this.conn.task_queue.subscribe(
            d => this.process_join(d),
            {
                only: { command: "JOIN", params: [this.name] },
            }
        );

        this.part_subscription = this.conn.task_queue.subscribe(
            d => this.process_part(d),
            {
                only: { command: "PART", params: [this.name] },
            }
        );

        this.joined = true;
    }

    cleanup() {
        if (this.join_subscription) this.conn.task_queue.unsubscribe(this.join_subscription);
        if (this.nicks_subscription) this.conn.task_queue.unsubscribe(this.nicks_subscription);
        if (this.part_subscription) this.conn.task_queue.unsubscribe(this.part_subscription);
    }

    part() {
        this.cleanup();

        this.conn.send_raw("PART " + this.name);
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

    process_join(data: IrcMessageEvent) {
        const joining_user = data.source?.[0];
        if (!joining_user) throw new Error("user joined but didn't, apparently");
        if (this.nicks.find(o => o.name == joining_user)) return;
        this.nicks.push(new Nick(joining_user));
        this.nicks_live.set(this.nicks);
    }

    process_part(data: IrcMessageEvent) {
        const parting_user = data.source?.[0];
        if (!parting_user) throw new Error("user parted but didn't, apparently");
        this.nicks = this.nicks.filter(o => o.name != parting_user);
        this.nicks_live.set(this.nicks);
    }
}