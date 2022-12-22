import {
    type iIrcProvider,
    type iIrcConnection,
    type ConnectionInfo,
    ProviderError,
    type IrcMessageEvent
} from "../provider+connection";
import { handle_raw_irc_msg } from "./common";
import { db, type Network } from "$lib/Storage/db";

enum LocalProviderError {
    NoWebsocket = "No websocket in this thing"
}

export class LocalProvider implements iIrcProvider {
    provider_id = "LocalProvider";

    connections: LocalIrcConnection[] = [];

    async up() {
        const conns = await this.fetch_persistent_connections()
        conns.forEach(
            (o) => {
                this.connections = [...this.connections, new LocalIrcConnection(o.conn_blueprint)];
            }
        );
    }

    connect_all() {
        let result = true;

        if (this.connections) {
            for (const connection of this.connections) {
                const connection_result = connection.connect();

                // return false if any connection fails.
                if (result == true) {
                    result = connection_result;
                }
            }
        } else {
            throw new Error(ProviderError.NoConnectionsInProvider);
        }

        return result;
    }

    add_connection(ci: ConnectionInfo): LocalIrcConnection {
        this.connections = [...this.connections, new LocalIrcConnection(ci)];
        const conn = this.connections.filter((o) => o.connection_info.name == ci.name)[0];
        if (conn) {
            return conn;
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

    async fetch_persistent_connections(): Promise<Network[]> {
        return db.networks
            .where("provider_id")
            .equals(this.provider_id)
            .toArray();
    }
}

class LocalIrcConnection implements iIrcConnection {
    connection_info: ConnectionInfo;
    isConnected: boolean;
    channels: (string | "server_msgs")[] = [];

    websocket?: WebSocket;

    on_msg?: (event: IrcMessageEvent) => void;

    constructor(ci: ConnectionInfo) {
        this.isConnected = false;
        this.connection_info = ci;
    }
    writer?: ReadableStream<any> | undefined;
    sender?: WritableStream<any> | undefined;
    on_connect?: (() => void) | undefined;

    connect() {
        this._establish_connection();

        if (this.websocket) {
            this.websocket.onopen = () => {
                this._identify();
                this.isConnected = true;
            }
            this.websocket.onmessage = (event) => {
                const msg = handle_raw_irc_msg(event.data, (msg) => {
                    console.log("sent", msg);
                    this.websocket?.send(msg)
                });

                if (this.on_msg) {
                    this.on_msg(msg);
                }
            }
            this.websocket.onclose = () => {
                console.info("Closed connection", this.connection_info.name)
                this.isConnected = false;
            }
        }

        return true;
    }

    async join_channel(chan: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async privmsg(target: string, msg: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private _establish_connection() {
        const url = this.connection_info.url;

        this.websocket = new WebSocket(url);
    }

    private _identify() {
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
            this.websocket.send(msg);
        }
    }
}