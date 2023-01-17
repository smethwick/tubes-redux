import type { Network } from "$lib/Storage/db";
import type { Capability } from "./caps";

export interface ConnectionInfo {
    name: string;
    icon: string;

    url: string;
    secure: boolean;
    server_password?: string;

    nick: string;
    realname: string;
    username: string;
}

export const default_icons = ['🍄', '🧅', '🧄', '🫘', '🌰', '🥜', '🥦', '🥬', '🍆'];

export const default_config: ConnectionInfo = {
    name: "",
    url: "wss://example.org",
    secure: false,
    icon: default_icons[Math.floor(Math.random() * default_icons.length)],
    nick: "tubes_user",
    realname: "https://leahc.gay/tubes",
    username: "tubes"
}


// type ProviderDef = {
//     display_name: string,
//     provider: instanceof,
// }

export enum ProviderError {
    NoConnectionsInProvider = "this provider has no connections in it",
    UnimplementedMethod = "you gotta implement this",
    ThisIsAnAbstractClass = "this is an abstract class. don't try to instantiate it",
}

/**
 * An IRC Provider.
 * 
 * Providers are used by Tubes as a way to interact with many of the
 * 100 quadrillion methods of getting your ass on an IRC network
 * (think native sockets, websockets, quassel, bouncers with good ircv3
 * support, irccloud, etc). 
 * 
 * If you wanna use Tubes with your favourite IRC Provider, just
 * implement this interface and hook the right things up to its api
 * or whatever. Have fun!
 */
export class IrcProvider {
    /**
     * Every connection in this provider. Use `connect_all()` to connect to em.
     */
    connections: iIrcConnection[] = [];

    /**
     * The place to check if the provider can use the current environment.
     * 
     * Useful if your provider needs to interact with system apis or
     * browser-specific stuff. If this fails, Tubes will refuse to do anything
     * with this provider.
     */
    supportsEnvironment?: (() => boolean);

    capabilities: Capability[] = [];
    supports(cap: Capability): boolean {
        return this.capabilities.includes(cap);
    }

    up(): void {
        throw new Error(ProviderError.UnimplementedMethod);
    }
    down?(): void;

    /**
     * Establish a connection to every connection in the `connections` field.
     */
    connect_all(): boolean {
        let result = true;
        this.connections.forEach((o) => {
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

        })
        return result;
    }

    add_connection(ci: ConnectionInfo): iIrcConnection {
        throw new Error(ProviderError.UnimplementedMethod);
    }
    add_persistent_connection(ci: ConnectionInfo): iIrcConnection {
        throw new Error(ProviderError.UnimplementedMethod);
    }
    async fetch_persistent_connections(): Promise<Network[]> {
        throw new Error(ProviderError.UnimplementedMethod);
    }

    constructor() {
        if (this.constructor == IrcProvider) {
            throw new Error(ProviderError.ThisIsAnAbstractClass);
        }
    }
}

/**
 * A single connection to an IRC network.
 */
export interface iIrcConnection {
    connection_info: ConnectionInfo;

    /**
     * Establish a connection to the server.
     */
    connect(): boolean;
    isConnected: boolean;

    channels: (string | "server_msgs")[];

    writer?: ReadableStream;
    sender?: WritableStream;

    join_channel(chan: string): Promise<void>;
    privmsg(target: string, msg: string): Promise<void>;

    on_connect?: () => void;
    on_msg?: (event: IrcMessageEvent) => void;
}

export interface IrcMessageEvent {
    tags?: { key: string, value?: string }[];
    source?: string;
    command: string;
    params: string[];
    timestamp: Date;
}