import {
    IrcProvider,
    type ConnectionInfo,
    ProviderError,
    type IrcMessageEvent,
    IrcConnection
} from "../provider+connection";
import { handle_raw_irc_msg } from "./common";
import { db } from "$lib/Storage/db";
import { ProviderFlags } from "../flags";
import { saveMessage } from "$lib/Storage/messages";
import { provider } from "..";

export class LocalProvider extends IrcProvider {
    provider_id = "LocalProvider";

    connections: [string, LocalIrcConnection][] = [];

    flags: ProviderFlags[] = [ProviderFlags.MultipleConnections];

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

    get_connections(): [string, LocalIrcConnection][] {
        return this.connections;
    }
}

export class LocalIrcConnection extends IrcConnection {
    websocket?: WebSocket;
    on_msg?: (event: IrcMessageEvent) => void = e => saveMessage(this.connection_info.name, e);
    on_connect?: (() => void) | undefined;

    request_caps: string[] = ['sasl'];

    connect() {
        this.isConnected.set("connecting");
        this._establish_connection();

        if (this.websocket) {
            this.websocket.onopen = () => {
                this._identify();
                this.task_queue.on('001', () => {
                    this.get_motd();
                    this.connection_info.channels.forEach((o) => {
                        this.join_channel(o);
                    })
                    console.log("fotnite", provider);
                });
            }
            this.websocket.onmessage = (event) => {
                console.debug("→", event.data);
                const msg = handle_raw_irc_msg(event.data, (msg) => {
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

    async send_raw(msg: string) {
        console.debug("←", msg)
        this.websocket?.send(msg);
    }

    async disconnect(quit_msg?: string) {
        this.send_raw(`QUIT ${quit_msg ? (":" + quit_msg) : ":tubing out"}`);
        setTimeout(() => {
            this.websocket?.close();
        }, 150);
    }

    private _establish_connection() {
        const url = this.connection_info.url;

        this.websocket = new WebSocket(url);
    }

    private async _identify() {
        const conninfo = this.connection_info;

        const to_send = [
            "CAP LS 302",
            conninfo.server_password ? `PASS ${conninfo.server_password}` : ``,
            `NICK ${conninfo.nick}`,
            `USER ${conninfo.username} 0 * :${conninfo.realname}`,
        ];

        // let prereg_finished = false;

        this.task_queue.subscribe(async (msg) =>
            (this.capabilities = [...this.capabilities, ...(await this.negotiate_capabilities(msg))]),
            {
                only: { command: "CAP", params: ['*', 'LS'] },
                until: { command: "CAP", params: ['*', 'ACK'] },
                unsub_callback: () => this.send_raw("CAP END")
            });
        // this.task_queue.on({command: "CAP", params: ["*", "ACK"]}, () => {
        //     this.send_raw("AUTHENTICATE PLAIN");
        //     this.send_raw(`AUTHENTICATE ${btoa("leah\0leah\0testtesttest")}`);
        //     prereg_finished = true;
        // })

        for (const msg of to_send) {
            if (msg) this.send_raw(msg);
        }

        this.task_queue.wait_for("001").then(() => this.isConnected.set(true));
    }
}
