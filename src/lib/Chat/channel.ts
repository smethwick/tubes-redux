import { MessageTypes } from "$lib/Storage/messages";
import { writable, type Writable } from "svelte/store";
import { ChatFrame, ChatStack } from "./logs";
import { Nick } from "./nick";
import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export class Channel {
    nicks: Nick[];
    nicks_live: Writable<Nick[]>;

    nicks_subscription?: string;
    join_subscription?: string;
    part_subscription?: string;
    topic_subscription?: string;
    topic_getter_subscription?: string;

    joined = false;
    joined_live = writable(this.joined);

    topic: [string, Nick?, Date?] = ["topic"];
    topic_live: Writable<[string, Nick?, Date?]>;

    session_frame: ChatFrame;
    logs: ChatStack;

    constructor(private conn: IrcConnection, public name: string) {
        this.nicks_live = writable([]);
        this.topic_live = writable();
        this.nicks = [];

        this.logs = new ChatStack(this.conn, this.name, "chathistory");
        this.session_frame = new ChatFrame(this.conn, []);
    }

    async join() {
        this.conn.send_raw("JOIN " + this.name);
        await this.conn.task_queue.wait_for({ command: "JOIN", params: [this.name] })
        await this.setup();
    }

    async setup() {
        this.nicks_subscription = this.conn.task_queue.subscribe(
            d => this.process_names(d),
            {
                only: { command: "353", params: ["*", "*", this.name] },
                until: { command: "366", params: ["*", this.name] }
            }
        );

        try {
            await this.conn.task_queue.wait_for({ command: "366", params: ["*", this.name] }, {
                reject_on: [
                    { command: "461", params: ["*", this.name] },
                    { command: "403", params: ["*", this.name] },
                    { command: "405", params: ["*", this.name] },
                    { command: "475", params: ["*", this.name] },
                    { command: "474", params: ["*", this.name] },
                    { command: "471", params: ["*", this.name] },
                    { command: "473", params: ["*", this.name] },
                    { command: "476", params: ["*", this.name] },
                    { command: "477", params: ["*", this.name] },
                ]
            });
        } catch (e) {
            throw new Error(String(e));
        }

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

        this.topic_subscription = this.conn.task_queue.subscribe(
            d => this.process_topic(d), {
            only: { command: "TOPIC", params: [this.name] },
        });

        await this.get_topic();

        this.set_joined_status(true);
    }

    cleanup() {
        if (this.join_subscription) this.conn.task_queue.unsubscribe(this.join_subscription);
        if (this.nicks_subscription) this.conn.task_queue.unsubscribe(this.nicks_subscription);
        if (this.part_subscription) this.conn.task_queue.unsubscribe(this.part_subscription);
        if (this.topic_getter_subscription) this.conn.task_queue.unsubscribe(this.topic_getter_subscription);
        if (this.topic_subscription) this.conn.task_queue.unsubscribe(this.topic_subscription);
    }

    part(msg?: string) {
        this.cleanup();

        this.conn.send_raw(`PART ${this.name} :${msg ? msg : "tubing out"}`);
        this.set_joined_status(false);
    }

    privmsg(msg: string) {
        this.conn.privmsg(this.name, msg);
        this.session_frame.push({
            type: MessageTypes.PrivMsg,
            network: this.conn.connection_info.name,
            command: "PRIVMSG",
            target: this.name,
            timestamp: new Date(Date.now()),
            content: msg,
            source: [this.conn.nick]
        })
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

    process_topic(data: IrcMessageEvent) {
        const new_topic = data.params.last();
        const new_nick = data.params[2];

        this._set_topic_inner({ topic: new_topic, nick: new_nick })
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

    async get_topic(): Promise<[string, (Nick | undefined)?, (Date | undefined)?] | undefined> {
        this.conn.send_raw("TOPIC " + this.name);

        let topic = "";
        let timestamp: Date | undefined;
        let nick: Nick | undefined;

        this.topic_getter_subscription = this.conn.task_queue.subscribe(o => {
            if (o.command == "331") return
            if (o.command == "332") {
                topic = o.params.last();
                this.topic = [topic, this.topic[1], this.topic[2]];
                this.topic_live.set(this.topic);
            }
            if (o.command == "333") {
                nick = new Nick(o.params[2]);
                timestamp = new Date(Number(o.params[3]) * 1000);
                this.topic = [this.topic[0], nick, timestamp];
                this.topic_live.set(this.topic);
            }
        }, {
            until: [
                // RPL_NOTOPIC
                { command: "331", params: ["*", this.name] },
                // RPL_TOPICWHOTIME
                { command: "333", params: ["*", this.name] },
            ],
            only: [
                // RPL_NOTOPIC
                { command: "331", params: ["*", this.name] },
                // RPL_TOPIC
                { command: "332", params: ["*", this.name] },
                // RPL_TOPICWHOTIME
                { command: "333", params: ["*", this.name] },
            ],
            handle_errors: [
                { command: "482", params: ["*", this.name] },
                { command: "442", params: ["*", this.name] },
                { command: "403", params: ["*", this.name] },
                { command: "461", params: ["*"] },
            ],
        });

        await this.conn.task_queue.wait_for([
            { command: "331", params: ["*", this.name] },
            { command: "333", params: ["*", this.name] },
        ]);

        // this.topic = [topic, nick, timestamp];
        // this.topic_live.set(this.topic);

        return this.topic;
    }

    private _set_topic_inner({ topic, nick, timestamp }: { topic?: string, nick?: Nick | string, timestamp?: Date | string }) {
        topic = topic ?? this.topic[0];
        if (typeof nick === "string") nick = new Nick(nick);
        nick = nick ?? this.topic[1];
        if (typeof timestamp === "string") timestamp = new Date(Number(timestamp) * 1000);
        timestamp = timestamp ?? this.topic[2];

        this.topic = [topic, nick, timestamp];
        this.topic_live.set(this.topic);
    }
}