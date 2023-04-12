import { redirect } from "@sveltejs/kit";
import { Channel } from "../channel";
import { ProviderFlags } from "../flags";
import { IrcConnection, IrcProvider, type ConnectionInfo, type IrcMessageEvent } from "../provider+connection";
import { Saslinator } from "../sasl";
import { TaskQueue } from "../task";
import { LocalIrcConnection } from "./local";

async function get_info_bad() {    
    const login = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const url = localStorage.getItem("url");

    if (!login || !password || !url) throw redirect(302, '/setup');

    return [login, password, url]
}

export class SojuProvider extends IrcProvider {
    friendly_name: string = "Soju";

    conn?: LocalIrcConnection;
    connections: [string, SojuConnection][] = [];

    proto: 'ws' | 'tcp';
    supported_protos: ("ws" | "wss" | "ircs" | "irc")[] = ["ircs", "irc", "ws", "wss"];

    flags: ProviderFlags[] = [ProviderFlags.MultipleConnections, ProviderFlags.StoreLogs];

    task_queue: TaskQueue;

    constructor(
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
            const [login, password, url] = await get_info_bad();

            this.conn = new LocalIrcConnection({
                autojoin: [],
                name: "soju",
                nick: login,
                realname: login,
                username: login,
                secure: true,
                url: url,
                sasl: {
                    username: login,
                    password: password
                }
            }, this);
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
                this
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

    on_msg = () => null;

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
    requested_caps: string[] = [
        'sasl', 
        'soju.im/bouncer-networks',
        'draft/chathistory',
        'batch', 
        'cap-notify',
        'server-time',
        'message-tags',
        'draft/event-playback',
    ];

    websocket?: WebSocket;
    nick: string;

    constructor(
        private bind_to: string,
        public connection_info: ConnectionInfo,
        public parent_info: ConnectionInfo,
        connected: boolean,
        public provider: SojuProvider,
    ) {
        super(connection_info, provider);
        this.saslinator = new Saslinator(this, parent_info.sasl);
        this.nick = this.parent_info.nick;
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
            this.pinger.start();
            console.log(this.nick);

            this.task_queue.subscribe(d => {
                if (d.source && d.source[0] == this.nick) {
                    if (this.channels.find(o => o.name == d.params[0])) return;
                    const channel = new Channel(this, d.params[0]);
                    channel.setup();
                    this.channels.push(channel)
                    this.channel_store.set(this.channels);
                }
            }, {
                only: { command: "JOIN"},
            })
        }


        this.websocket.onmessage = l => this.handle_incoming(l.data, this.bind_to);
        return true;
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