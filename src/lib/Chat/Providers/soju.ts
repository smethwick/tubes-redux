import { ProviderFlags } from "../flags";
import { IrcConnection, IrcProvider, type ConnectionInfo, type IrcMessageEvent } from "../provider+connection";
import { Saslinator } from "../sasl";
import { TaskQueue } from "../task";
import { LocalIrcConnection } from "./local";

export class SojuProvider extends IrcProvider {
    conn?: LocalIrcConnection;
    connections: [string, SojuConnection][] = [];

    proto: 'ws' | 'tcp';
    supported_protos: ("ws" | "wss" | "ircs" | "irc")[] = ["ircs", "irc", "ws", "wss"];

    flags: ProviderFlags[] = [ProviderFlags.MultipleConnections];

    task_queue: TaskQueue;

    constructor(private url: string,
        private username: string,
        private password: string,
        opt: { protocol: 'ws' | 'tcp' }
    ) {
        super();
        if (opt.protocol == "tcp") throw new Error("TCP support is yet to be implemented");
        this.proto = opt.protocol;
        this.task_queue = new TaskQueue();
    }

    supportsEnvironment?: (() => boolean) | undefined = () => true;
    async up() {
        if (this.active) return;
        await this.up_lock.acquire("up-lock", async () => {
            if (this.active) return;
            this.conn = new LocalIrcConnection({
                autojoin: [],
                name: "soju",
                nick: "leah",
                realname: "leah",
                username: "leah",
                secure: true,
                url: this.url,
                sasl: {
                    username: this.username,
                    password: this.password,
                }
            });
            this.conn.requested_caps = [...this.conn.requested_caps, "soju.im/bouncer-networks", "batch"];
            await this.conn.connect();
            this.active = true;
        })

        this.conn?.send_raw("BOUNCER LISTNETWORKS");
        const collected = await this.conn?.task_queue.collect_batch("soju.im/bouncer-networks")
        collected?.forEach(o => {
            const parsed = this.parse_listed_network(o);
            if (this.conn) this.connections.push([parsed[0], new SojuConnection(
                parsed[0],
                parsed[1],
                this.conn?.connection_info,
                parsed[2] != "disconnected",
            )]);
        });
    }
    down(): void {
        throw new Error("Method not implemented.");
    }
    add_connection(ci: ConnectionInfo): Promise<IrcConnection> {
        throw new Error("Method not implemented.");
    }
    add_persistent_connection(ci: ConnectionInfo): Promise<IrcConnection> {
        throw new Error("Method not implemented.");
    }

    async get_connections(): Promise<[string, IrcConnection][]> {
        return this.connections;
    }

    private parse_listed_network(msg: IrcMessageEvent)
        : [string, ConnectionInfo, ("connected" | "connecting" | "disconnected")] {
        const id = msg.params[1];
        const details_line = msg.params[2];
        const split_details = details_line.split(";");
        const details: [key: string, value: string][] =
            split_details.map(o => { const [key, value] = o.split("="); return [key, value] });

        const get_value: (key: string) => string = (key) => (details.find(o => o[0] == key) ?? ["", ""])[1];

        const ci: ConnectionInfo = {
            secure: Boolean(get_value("tls")),
            display_name: get_value("name"),
            name: id,
            url: "",
            autojoin: [],
            server_password: get_value("pass") ?? undefined,
            nick: get_value("nickname"),
            realname: get_value("realname"),
            username: get_value("username")
        }

        const state = get_value("state");

        if (state != "connected" && state != "connecting" && state != "disconnected")
            throw new Error("invalid state");

        return [id, ci, state];
    }
}

export class SojuConnection extends IrcConnection {
    requested_caps: string[] = ['sasl', 'soju.im/bouncer-networks'];
    websocket?: WebSocket;

    constructor(
        private bind_to: string,
        public connection_info: ConnectionInfo,
        public parent_info: ConnectionInfo,
        connected: boolean,
    ) {
        super(connection_info);
        this.saslinator = new Saslinator(this, parent_info.sasl);

        if (connected) this.connect();
    }

    async connect(): Promise<boolean> {
        this.websocket = new WebSocket(this.parent_info.url)

        this.isConnected.set("connecting");

        this.websocket.onopen = async () => {
            await this.identify(this.parent_info, async () => {
                this._bind();
            });
            this.get_motd();
            this.join_all_channels();
            this.pinger.start();
        }

        this.websocket.onmessage = l => this.handle_incoming(l.data, this.bind_to);
        throw new Error("Method not implemented.");
    }

    send_raw(msg: string): void {
        if (!this.websocket) throw new Error("no websocket");
        console.debug(`${this.bind_to} ←`, msg)
        this.websocket.send(msg);
    }

    disconnect(): void {
        throw new Error("Method not implemented.");
    }

    on_connect?: (() => void) | undefined;

    private _bind() {
        this.send_raw(`BOUNCER BIND ${this.bind_to}`)
    }
}