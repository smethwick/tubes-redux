import type { Nick } from "./nick";
import type { IrcConnection } from "./provider+connection";

export class Channel {
    members: Nick[] = [];

    constructor(private conn: IrcConnection, public name: string) {}

    join() {
        this.conn.join_channel(this.name);
    }

    privmsg(msg: string) {
        this.conn.privmsg(this.name, msg);
    }
}