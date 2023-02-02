import { IrcConnection, IrcProvider, type ConnectionInfo } from "../provider+connection";
import { TaskQueue } from "../task";
import { LocalIrcConnection } from "./local";

export class SojuProvider extends IrcProvider {
    conn?: LocalIrcConnection;
    proto: 'ws' | 'tcp';

    task_queue: TaskQueue;

    constructor(private url: string, opt: { protocol: 'ws' | 'tcp' }) {
        super();
        if (opt.protocol == "tcp") throw new Error("TCP support is yet to be implemented");
        this.proto = opt.protocol;
        this.task_queue = new TaskQueue();
    }

    supportsEnvironment?: (() => boolean) | undefined;
    async up() {
        if (this.active) return;
        await this.up_lock.acquire("up-lock", async () => {
            if (this.active) return;
            this.conn = new LocalIrcConnection({
                channels: [],
                icon: '⚡',
                name: "soju",
                nick: "leah",
                realname: "leah",
                username: "leah",
                secure: true,
                url: this.url,
            });
            this.conn.request_caps.push("soju.im/bouncernetworks");
            this.conn.connect();
            this.active = true;
        })

    }
    down?(): void {
        throw new Error("Method not implemented.");
    }
    add_connection?(ci: ConnectionInfo): IrcConnection {
        throw new Error("Method not implemented.");
    }
    add_persistent_connection?(ci: ConnectionInfo): IrcConnection {
        throw new Error("Method not implemented.");
    }
    get_connections(): [string, IrcConnection][] {
        throw new Error("Method not implemented.");
    }
}

export class SojuConnection extends IrcConnection {
    request_caps: string[] = [];
    
    connect(): boolean {
        throw new Error("Method not implemented.");
    }
    send_raw(msg: string): void {
        throw new Error("Method not implemented.");
    }
    disconnect(): void {
        throw new Error("Method not implemented.");
    }
    on_connect?: (() => void) | undefined;

}