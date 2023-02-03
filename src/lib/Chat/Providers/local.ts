import {
    IrcProvider,
    type ConnectionInfo,
    ProviderError,
    type IrcMessageEvent,
    IrcConnection,
    Params
} from "../provider+connection";
import { db } from "$lib/Storage/db";
import { ProviderFlags } from "../flags";
import { saveMessage } from "$lib/Storage/messages";

export class LocalProvider extends IrcProvider {
    provider_id = "LocalProvider";

    connections: [string, LocalIrcConnection][] = [];

    supported_protos: ("ws" | "wss" | "ircs" | "irc")[] = ["ws", "wss"];

    flags: ProviderFlags[] = [ProviderFlags.MultipleConnections];

    async up() {
        if (this.active) return;
        await this.up_lock.acquire("up-lock", async () => {
            if (this.active) return;
            const conns = await LocalProvider.fetch_persistent_connections(this.provider_id)
            conns.forEach(
                (o) => this.connections.push([
                    o.conn_blueprint.name,
                    new LocalIrcConnection(o.conn_blueprint)
                ])
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
        if (this.get_connection(ci.name))
            throw new Error("a connection with this name already exists");

        this.connections = [...this.connections, [ci.name, new LocalIrcConnection(ci)]];
        this.update_sidebar_conns();
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
        this.setup_channels();

        if (this.websocket) {
            this.websocket.onopen = () => this.handle_open();
            this.websocket.onmessage = (event) => this.handle_incoming(event.data);
            this.websocket.onclose = () => this.handle_close();
        }

        return true;
    }

    async send_raw(msg: string) {
        console.debug("←", msg)
        this.websocket?.send(msg);
    }

    async disconnect(quit_msg?: string) {
        this.send_raw(`QUIT ${quit_msg ? (":" + quit_msg) : ":tubing out"}`);
        this.channels.forEach(o =>
            saveMessage(this.connection_info.name, {
                command: "QUIT",
                params: quit_msg
                    ? new Params(o.name, quit_msg)
                    : new Params(o.name, "tubing out"),
                timestamp: new Date(Date.now()),
                source: [this.connection_info.nick, "", ""],
            }));
        setTimeout(() => {
            this.websocket?.close();
        }, 150);
    }

    private _establish_connection() {
        const url = this.connection_info.url;

        this.websocket = new WebSocket(url);
    }
}
