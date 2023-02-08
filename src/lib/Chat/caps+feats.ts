import type { IrcConnection } from "./provider+connection";

export class Capability {
    cap: string;
    values: string[];

    constructor(private conn: IrcConnection, capstring: string ) {
        const [cap, values] = capstring.split("=");
        let split_values: string[] = [];
        if (values) split_values = values.split(",");

        this.cap = cap;
        this.values = split_values
    }

    async request() {
        this.conn.send_raw(`CAP REQ :${this.cap}`);
        this.conn.task_queue.wait_for({command: "CAP", params: ["ACK", this.cap]})
    }
}

export class Feature {
    
}