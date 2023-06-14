import { MessageTypes, type Message } from "$lib/Storage/messages";
import { writable, type Writable } from "svelte/store";
import { MessageLogList } from "./logs";
import { Nick } from "./nick";
import type { IrcConnection, RawIrcMessage } from "./provider+connection";
import { MessageMatcher, MessageMatcherGroup, Subscription, Wildcard, group, match } from "./task";
import { IrcCommand } from "./Providers/common";

export class Channel {
    nicks: Nick[];
    nicks_live: Writable<Nick[]>;

    nicks_subscription?: Subscription;
    join_subscription?: Subscription;
    part_subscription?: Subscription;
    topic_subscription?: Subscription;
    topic_getter_subscription?: Subscription;

    joined = false;
    joined_live = writable(this.joined);

    topic: [string, Nick?, Date?] = ["topic"];
    topic_live: Writable<[string, Nick?, Date?]>;

    session: MessageLogList;
    backlog?: MessageLogList;
    pending: Message[] = [];
    pending_live: Writable<Message[]> = writable(this.pending);

    constructor(public conn: IrcConnection, public name: string) {
        this.nicks_live = writable([]);
        this.topic_live = writable();
        this.nicks = [];

        this.session = new MessageLogList(this.conn, []);
    }

    async join() {
        this.conn.send_raw("JOIN " + this.name);
        await this.conn.task_queue.expect_message(`join ${this.name}`, ["JOIN"]);
        await this.setup();
    }

    async setup() {
        const names_msgs = await this.conn.task_queue.collect(
            `get names for ${this.name}`, {
            start: 'immediately',
            include: match(IrcCommand.RPL_NAMREPLY, [Wildcard.Any, Wildcard.Any, this.name]),
            finish: match(
                "366", [Wildcard.Any, this.name]
            ),
            reject_on: group([
                ["461", ["*", this.name]],
                ["403", ["*", this.name]],
                ["405", ["*", this.name]],
                ["475", ["*", this.name]],
                ["474", ["*", this.name]],
                ["471", ["*", this.name]],
                ["473", ["*", this.name]],
                ["476", ["*", this.name]],
                ["477", ["*", this.name]],
            ])
        });

        names_msgs.forEach(o => this.process_names(o));

        this.join_subscription = await this.conn.task_queue.subscribe(
            `listen for joins in ${this.name}`,
            match("JOIN", [this.name]),
            d => this.process_join(d),
        );

        this.part_subscription = await this.conn.task_queue.subscribe(
            `listen for parts in ${this.name}`,
            match("PART", [this.name]),
            d => this.process_part(d),
        );

        this.topic_subscription = await this.conn.task_queue.subscribe(
            `listen for topic changes in ${this.name}`,
            match("TOPIC", [this.name]),
            d => this.process_topic(d)
        );

        await this.get_topic();

        this.set_joined_status(true);
    }

    cleanup() {
        this.join_subscription?.unsubscribe();
        this.nicks_subscription?.unsubscribe();
        this.part_subscription?.unsubscribe();
        this.topic_getter_subscription?.unsubscribe();
        this.topic_subscription?.unsubscribe();
    }

    part(msg?: string) {
        this.cleanup();

        this.conn.send_raw(`PART ${this.name} :${msg ? msg : "tubing out"}`);
        this.set_joined_status(false);
    }

    async privmsg(msg: string) {
        const label = await this.conn.privmsg(this.name, msg);
        const msg_obj: Message = {
            type: MessageTypes.PrivMsg,
            network: this.conn.connection_info.name,
            command: "PRIVMSG",
            target: this.name,
            timestamp: new Date(Date.now()),
            content: msg,
            source: [this.conn.nick]
        };

        if (this.conn.capman.hasCap('echo-message')) {
            // if (!label) return;
            this.pending.push(msg_obj);
            this.pending_live.set(this.pending);

            if (label) {
                await this.conn.task_queue.expect_message(
                    "wait for echo'd message",
                    ["PRIVMSG", [], { tags: [{ key: "label", value: label }] }]
                );
            } else {
                await this.conn.task_queue.expect_message(
                    "wait for echo'd message",
                    ["PRIVMSG", [this.name, msg]]
                );
            }

            this.pending = [];
            this.pending_live.set(this.pending);
        } else {
            this.session.push(msg_obj);
        }
    }


    process_names(data: RawIrcMessage) {
        const param = data.params.last();
        const names_split = param.split(" ");
        const nicks = names_split.map(o => new Nick(o));
        this.set_nicks([...this.nicks, ...nicks]);
    }

    process_join(data: RawIrcMessage) {
        const joining_user = data.source?.[0];
        if (joining_user == this.conn.connection_info.nick) this.set_joined_status(true);
        if (!joining_user) throw new Error("user joined but didn't, apparently");
        if (this.nicks.find(o => o.name == joining_user)) return;
        this.set_nicks([...this.nicks, new Nick(joining_user)]);
    }

    process_part(data: RawIrcMessage) {
        const parting_user = data.source?.[0];
        if (parting_user == this.conn.connection_info.nick) this.set_joined_status(false);
        if (!parting_user) throw new Error("user parted but didn't, apparently");
        this.set_nicks(this.nicks.filter(o => o.name != parting_user));
    }

    process_topic(data: RawIrcMessage) {
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

        const msgs = await this.conn.task_queue.collect(
            `collect topic for ${this.name}`,
            {
                start: group([
                    [IrcCommand.RPL_TOPIC, ['*', this.name]],
                    [IrcCommand.RPL_NOTOPIC, ['*', this.name]],
                ]),
                include: group([
                    [IrcCommand.RPL_TOPIC, ['*', this.name]],
                    [IrcCommand.RPL_NOTOPIC, ['*', this.name]],
                    [IrcCommand.RPL_TOPICWHOTIME, ['*', this.name]],
                ]),
                finish: match(IrcCommand.RPL_TOPICWHOTIME, ['*', this.name]),
                reject_on: group([
                    [IrcCommand.ERR_CHANOPRIVSNEEDED, ['*', this.name]],
                    [IrcCommand.ERR_NOTONCHANNEL, ['*', this.name]],
                    [IrcCommand.ERR_NOSUCHCHANNEL, ['*', this.name]],
                ]),
                include_start_and_finish: true,
            }
        );

        for (const msg of msgs) {
            switch (msg.command) {
                case IrcCommand.RPL_TOPIC: {
                    topic = msg.params.last();
                    this.topic = [topic, this.topic[1], this.topic[2]];
                    this.topic_live.set(this.topic);
                    return;
                }
                case IrcCommand.RPL_NOTOPIC: return;
                case IrcCommand.RPL_TOPICWHOTIME: {
                    nick = new Nick(msg.params[2]);
                    timestamp = new Date(Number(msg.params[3]) * 1000);
                    this.topic = [this.topic[0], nick, timestamp];
                    this.topic_live.set(this.topic);
                    return;
                }
                default: return;
            }
        }
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