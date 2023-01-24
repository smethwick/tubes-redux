import {
    IrcProvider,
    type iIrcConnection,
    type ConnectionInfo,
    ProviderError,
    type IrcMessageEvent
} from "../provider+connection";
import { handle_raw_irc_msg } from "./common";
import { db } from "$lib/Storage/db";
import { Capability } from "../caps";
import { saveMessage } from "$lib/Storage/messages";
import { writable, type Writable } from "svelte/store";
import { TaskQueue } from "../task";

enum LocalProviderError {
    NoWebsocket = "No websocket in this thing"
}

export class LocalProvider extends IrcProvider {
    provider_id = "LocalProvider";

    connections: [string, LocalIrcConnection][] = [];

    capabilities: Capability[] = [Capability.MultipleConnections];

    async up() {
        if (this.active) return;
        await this.up_lock.acquire("up-lock", async () => {
            if (this.active) return;
            const conns = await LocalProvider.fetch_persistent_connections(this.provider_id)
            conns.forEach(
                (o) => {
                    this.connections =
                        [
                            ...this.connections,
                            [
                                o.conn_blueprint.name,
                                new LocalIrcConnection(o.conn_blueprint)
                            ]
                        ];
                }
            );
            this.active = true;
        })
    }

    supportsEnvironment = () => {
        return true;
    };

    down() {
        throw new Error(ProviderError.UnimplementedMethod)
    }

    add_connection(ci: ConnectionInfo): LocalIrcConnection {
        if (this.connections.find((o) => o[0] == ci.name))
            throw new Error("a connection with this name already exists");

        this.connections = [...this.connections, [ci.name, new LocalIrcConnection(ci)]];
        const conn = this.connections.filter((o) => o[1].connection_info.name == ci.name)[0];

        if (conn) {
            return conn[1];
        } else {
            throw new Error("couldn't get connection from provider")
        }
    }

    add_persistent_connection(ci: ConnectionInfo): LocalIrcConnection {
        const conn = this.add_connection(ci);
        db.networks.add({
            name: ci.name,
            conn_blueprint: ci,
            provider_id: this.provider_id
        })
        return conn;
    }

    static async fetch_persistent_connections(provider_id: string) {
        return db.networks
            .where("provider_id")
            .equals(provider_id)
            .toArray();
    }
}

class LocalIrcConnection implements iIrcConnection {
    connection_info: ConnectionInfo;
    isConnected: Writable<boolean | "connecting">;
    channels: (string | "server_msgs")[] = [];
    task_queue: TaskQueue = new TaskQueue();

    websocket?: WebSocket;

    on_msg?: (event: IrcMessageEvent) => void = saveMessage;

    constructor(ci: ConnectionInfo) {
        this.isConnected = writable(false);
        this.connection_info = ci;
    }
    writer?= undefined;
    sender?= undefined;
    on_connect?: (() => void) | undefined;

    connect() {
        this.isConnected.set("connecting");
        this._establish_connection();

        if (this.websocket) {
            this.websocket.onopen = () => {
                this._identify();
                this.get_motd();
                this.connection_info.channels.forEach((o) => {
                    this.join_channel(o);
                })
            }
            this.websocket.onmessage = (event) => {
                const msg = handle_raw_irc_msg(event.data, (msg) => {
                    console.log("sent", msg);
                    this.websocket?.send(msg)
                });
                this.task_queue.resolve_tasks(msg);

                if (this.on_msg) {
                    this.on_msg(msg);
                }
            }
            this.websocket.onclose = () => {
                console.info("Closed connection", this.connection_info.name)
                this.isConnected.set(false);
            }
        }

        return true;
    }

    async join_channel(chan: string): Promise<void> {
        this.send_raw(`JOIN ${chan}`);
        this.task_queue.wait_for("JOIN", () => {
            this.channels = [...this.channels, chan];
            console.log(this.channels);
        })

    }

    async privmsg(target: string, msg: string): Promise<void> {
        const connected = this.check_connection();
        if (!connected) throw new Error("not connected");

        this.send_raw(`PRIVMSG ${target} :${msg}`);
        saveMessage({
            command: "PRIVMSG",
            params: [target, msg],
            timestamp: new Date(Date.now()),
            source: [this.connection_info.nick, this.connection_info.username, "localhost"],
        })
    }

    async send_raw(msg: string) {
        this.websocket?.send(msg);
    }

    async disconnect(quit_msg?: string) {
        this.send_raw(`QUIT ${quit_msg ? (":" + quit_msg) : ":tubing out"}`);
        setTimeout(() => {
            this.websocket?.close();
        }, 150);
    }

    check_connection(): boolean {
        let connected;
        const unsub = this.isConnected.subscribe((value) => {
            connected = value;
        })
        unsub();

        console.log(connected);

        return connected == true
    }

    motd: Writable<string> = writable("");
    motd_gotten = false;
    async get_motd() {
        if (this.motd_gotten) return;
        this.send_raw("MOTD");
        this.task_queue.subscribe(
            console.log,
            {
                // RPL_MOTD
                only: "372",
                // RPL_ENDOFMOTD
                until: "376",
                handle_errors: {
                    callback: (data) => {
                        // TODO: embetter this
                        throw new Error(data.params[0]);
                    },
                    // ERR_NOSUCHSERVER and ERR_NOMOTD respectively
                    errors: ["402", "422"]
                },
                // update the store when everything's been recieved
                unsub_callback: (collected) => {
                    console.log(collected);

                    this.motd.set(collected
                        ? collected
                            .map((o) => o.params[o.params.length - 1])
                            .join("\n")
                        : "something went wrong");

                    this.motd_gotten = true;
                }
            }
        );

    }

    private _establish_connection() {
        const url = this.connection_info.url;

        this.websocket = new WebSocket(url);
    }

    private async _identify() {
        if (!this.websocket) {
            throw new Error(LocalProviderError.NoWebsocket);
        }

        const conninfo = this.connection_info;

        const to_send = [
            "CAP LS 302",
            conninfo.server_password ? `PASS ${conninfo.server_password}` : ``,
            `NICK ${conninfo.nick}`,
            `USER ${conninfo.username} 0 * :${conninfo.realname}`,
            // do capability negotiation here at some point
            "CAP END",
        ];

        for (const msg of to_send) {
            console.log(msg);
            this.send_raw(msg);
        }
        this.task_queue.wait_for("001", () => this.isConnected.set(true));
    }
}
