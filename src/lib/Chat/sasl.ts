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

        await this.conn.task_queue.expect_message(
            "await sasl AUTHENTICATE", 
            ["AUTHENTICATE", ['+']]
        )
        
        console.log("here")
        this.conn.send_raw(`AUTHENTICATE ${window.btoa(
            `${this.info.username}\0${this.info.username}\0${this.info.password}`
        )}`);
        await this.conn.task_queue.expect_message("await sasl success", ["903"], {
            reject_on: [
                ["902"] /* ERR_NICKLOCKED */,
                ["904"] /* ERR_SASLFAIL */,
                ["905"] /* RR_SASLTOOLONG */,
                ["906"] /* RR_ERR_SASLABORTED */,
                ["907"] /* RR_SASLALREADY */,
            ]
        });
    }
}