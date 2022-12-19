import {
    type iIrcProvider,
    type iIrcConnection,
    type ConnectionInfo,
    ProviderError,
    type IrcMessageEvent
} from "../provider+connection";
import { handle_raw_irc_msg } from "./common";

enum LocalProviderError {
    NoWebsocket = "No websocket in this thing"
}

export class LocalProvider implements iIrcProvider {
    connections: Map<string, LocalIrcConnection> = new Map;

    connect_all() {
        let result = true;

        if (this.connections) {
            for (const connection of this.connections) {
                const connection_result = connection[1].connect();

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
        this.connections.set(ci.name, new LocalIrcConnection(ci));
        const conn = this.connections.get(ci.name);
        if (conn) {
            return conn;
        } else {
            throw new Error("couldn't get connection from provider")
        }
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
    private send_msg(msg: string) {
        if (this.websocket) {
            console.log(msg);
            this.websocket.send(msg);
        } else {
            throw new Error(LocalProviderError.NoWebsocket);
        }
    }
    private async handle_msg(e: MessageEvent) {
        console.log(e.data);
    }
}