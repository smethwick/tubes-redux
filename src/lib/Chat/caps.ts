import type { IrcConnection, IrcMessageEvent } from "./provider+connection";
import { Deferred, Wildcard } from "./task";

export class CapabilityManager {
    capabilities: Capability[] = [];
    available: Capability[] = [];

    new_sub: string;
    del_sub: string;

    constructor(private conn: IrcConnection) {
        this.new_sub = this.conn.task_queue.subscribe((d) => this.new(d.params.last()), {
            only: { command: "CAP", params: ["*", "NEW"] },
        })

        this.del_sub = this.conn.task_queue.subscribe((d) => this.del(d.params.last()), {
            only: { command: "CAP", params: ["*", "DEL"] },
        })
    }

    async negotiate() {
        const wait_for_caps = new Deferred();

        const collected_msgs: IrcMessageEvent[] = []
        this.conn.task_queue.subscribe(o => collected_msgs.push(o),
            {
                only: { command: "CAP", params: [Wildcard.Any, 'LS', Wildcard.Any] },
                until: [
                    { command: "001" },
                    { command: "CAP", params: 3 }
                ],
                unsub_callback: async () => {
                    for (const o of collected_msgs) {
                        await this.process_caps(o);
                    }
                    if (wait_for_caps.resolve) wait_for_caps.resolve(null);
                }
            });

        this.conn.send_raw("CAP LS 302");

        await wait_for_caps.promise;
    }

    private async process_caps(msg: IrcMessageEvent) {
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
                await cap.request();
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
        console.log("new caps", caps);
    }

    del(cap: string) {
        const caps = cap.split(" ");

        this.available = this.available.filter(o => !caps.find(c => o.cap == c));
        this.capabilities = this.capabilities.filter(o => !caps.find(c => o.cap == c));

        console.log("del caps", caps);
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
        this.conn.task_queue.wait_for({ command: "CAP", params: ["ACK", this.cap] })
    }
}