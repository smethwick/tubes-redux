import { IrcCommand } from "./Providers/common";
import type { IrcConnection, RawIrcMessage } from "./provider+connection";
import { Deferred, MessageMatcher, MessageMatcherGroup, Subscription, Wildcard, group, match } from "./task";

export class CapabilityManager {
    capabilities: Capability[] = [];
    available: Capability[] = [];

    new_sub?: Subscription;
    del_sub?: Subscription;

    constructor(private conn: IrcConnection) {
        this.conn.task_queue.subscribe(
            `Receive new capabilities for connection ${conn.connection_info?.name}`,
            match("CAP", [Wildcard.Any, "NEW"]),
            (message) => this.new(message.params.last()),
        ).then(value => this.new_sub = value)

        this.conn.task_queue.subscribe(
            `Receive revoked capabilities for connection ${conn.connection_info?.name}`,
            match("CAP", [Wildcard.Any, "DEL"]),
            (message) => this.del(message.params.last()),
        ).then(value => this.del_sub = value)
    }

    async negotiate() {
        this.conn.send_raw("CAP LS 302");

        const msgs = await this.conn.task_queue.collect(
            "get avaliable capabilities", {
            start: "immediately",
            include: group([
                ["CAP", [Wildcard.Any, "LS", Wildcard.Any, Wildcard.Any]],
            ]),
            finish: group([
                [IrcCommand.RPL_WELCOME],
                ["CAP", [Wildcard.Any, "LS", Wildcard.Any]]
            ]),
            include_start_and_finish: true,
        });

        for (const msg of msgs) {
            await this.process_caps(msg);
        }
    }

    // FIXME: who fucking wrote this
    private async process_caps(msg: RawIrcMessage) {
        if (!msg) throw new Error("server didn't send caps");

        // this is... not great!
        if (!(msg.params[2] != '*' || msg.params[3])) throw new Error;
        const witty_variable_name = msg.params[3] || msg.params[2];
        const split_caps = witty_variable_name.split(" ");

        this.process_caps_but_different_name(split_caps)
    }

    private async process_caps_but_different_name(caps: string[]) {
        const c = caps.map((o) => new Capability(this.conn, o));
        c.forEach(o => this.available.push(o));
        for (const cap_name of this.conn.requested_caps) {
            const cap = c.find((o) => o.cap == cap_name);
            if (cap) {
                cap.request();
                this.capabilities.push(cap);
            }
        }
    }

    hasCap(cap: string) {
        return this.capabilities.find(o => o.cap == cap);
    }

    new(cap: string) {
        const caps = cap.split(" ");

        this.process_caps_but_different_name(caps);
    }

    del(cap: string) {
        const caps = cap.split(" ");

        this.available = this.available.filter(o => !caps.find(c => o.cap == c));
        this.capabilities = this.capabilities.filter(o => !caps.find(c => o.cap == c));
    }

    private _listen() {
        // this.conn.task_queue.subscribe();
    }
}

export class Capability {
    cap: string;
    values: string[];

    constructor(private conn: IrcConnection, capstring: string) {
        const [cap, values] = capstring.split("=");
        let split_values: string[] = [];
        if (values) split_values = values.split(",");

        this.cap = cap;
        this.values = split_values;
    }

    async request() {
        this.conn.send_raw(`CAP REQ :${this.cap}`);
        await this.conn.task_queue.expect_message(
            `${this.conn.connection_info.name}: expect ACK for ${this.cap}`,
            ["CAP", [Wildcard.Any, "ACK", this.cap]]
        );
    }
}