import { writable, type Writable } from "svelte/store";
import { Nick } from "./nick";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export class Channel {
    nicks: Nick[];
    nicks_live: Writable<Nick[]>;
    nicks_subscription?: string;
    join_subscription?: string;
    part_subscription?: string;

    joined = false;
    joined_live = writable(this.joined);

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

        await this.conn.task_queue.wait_for({ command: "366", params: ["*", this.name] });

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

        this.set_joined_status(true);
    }

    cleanup() {
        if (this.join_subscription) this.conn.task_queue.unsubscribe(this.join_subscription);
        if (this.nicks_subscription) this.conn.task_queue.unsubscribe(this.nicks_subscription);
        if (this.part_subscription) this.conn.task_queue.unsubscribe(this.part_subscription);
    }

    part(msg?: string) {
        this.cleanup();

        this.conn.send_raw(`PART ${this.name} :${msg ? msg : "tubing out"}`);
        this.set_joined_status(false);
    }

    privmsg(msg: string) {
        this.conn.privmsg(this.name, msg);
    }

    process_names(data: IrcMessageEvent) {
        const param = data.params.last();
        const names_split = param.split(" ");
        const nicks = names_split.map(o => new Nick(o));
        this.set_nicks([...this.nicks, ...nicks]);
    }

    process_join(data: IrcMessageEvent) {
        const joining_user = data.source?.[0];
        if (joining_user == this.conn.connection_info.nick) this.set_joined_status(true);
        if (!joining_user) throw new Error("user joined but didn't, apparently");
        if (this.nicks.find(o => o.name == joining_user)) return;
        this.set_nicks([...this.nicks, new Nick(joining_user)]);
    }

    process_part(data: IrcMessageEvent) {
        const parting_user = data.source?.[0];
        if (parting_user == this.conn.connection_info.nick) this.set_joined_status(false);
        if (!parting_user) throw new Error("user parted but didn't, apparently");
        this.set_nicks(this.nicks.filter(o => o.name != parting_user));
    }

    set_nicks(val: Nick[]) {
        this.nicks = val;
        this.nicks_live.set(val);
    }

    set_joined_status(val: boolean) {
        this.joined = val;
        this.joined_live.set(val);

        if (val == false) this.set_nicks([])
    }
}