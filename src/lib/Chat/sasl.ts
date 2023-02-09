import type { IrcConnection } from "./provider+connection";

export type SaslMethod = Plain | undefined;
export type Plain = { username: string, password: string };
//  todo: external, oauth, etc.

export class Saslinator {
    constructor(private conn: IrcConnection, private info: SaslMethod) { }

    async authenticate() {
        if (!this.conn.capman.hasCap("sasl"))
            throw new Error("SASL is not supported on this network");
        if (!this.info) throw new Error("no sasl stuff provided");

        this.conn.send_raw("AUTHENTICATE PLAIN");
        await this.conn.task_queue.wait_for({ command: "AUTHENTICATE", params: ['+'] })
        this.conn.send_raw(`AUTHENTICATE ${window.btoa(
            `${this.info.username}\0${this.info.username}\0${this.info.password}`
        )}`);
        await this.conn.task_queue.wait_for({ command: "903" }, {
            reject_on: [
                //  ERR_NICKLOCKED
                { command: "902" },
                //  ERR_SASLFAIL
                { command: "904" },
                // ERR_SASLTOOLONG
                { command: "905" },
                // ERR_ERR_SASLABORTED
                { command: "906" },
                // ERR_SASLALREADY
                { command: "907" },
            ]
        });
    }
}