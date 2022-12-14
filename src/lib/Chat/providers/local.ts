import {
    type iIrcProvider,
    type iIrcConnection,
    type ConnectionInfo,
    ProviderError
} from "../provider+connection";

enum LocalProviderError {
    NoWebsocket = "No websocket in this thing"
}

export class LocalProvider implements iIrcProvider {
    connections: LocalIrcConnection[] = [];

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

    add_connection(ci: ConnectionInfo) {
        this.connections.push(new LocalIrcConnection(ci));
    }
}

class LocalIrcConnection implements iIrcConnection {
    connection_info: ConnectionInfo;
    isConnected: boolean;

    websocket?: WebSocket;
    writer?: ReadableStream<string>;
    sender?: WritableStream<string>;

    constructor(ci: ConnectionInfo) {
        this.isConnected = false;
        this.connection_info = ci;
    }

    connect() {
        this._establish_connection();

        if (this.websocket) {
            this.websocket.onopen = (e) => {
                this._identify();
            }
            this.websocket.onmessage = (event) => {
                console.log(event.data);
            }
        }


        throw new Error("not yet implemented");
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
            `USER ${conninfo.username} 0 * ${conninfo.realname}`,
            // do capability negotiation here at some point
            "CAP END",
        ];

        for (const msg of to_send) {
            console.log(msg);
            this.websocket.send(msg);
        }
    }
}