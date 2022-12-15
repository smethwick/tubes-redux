import { LocalProvider } from "./providers/local";

export interface ConnectionInfo {
    name: string;
    icon?: typeof SVGElement;
    
    url: URL;
    secure: boolean;
    server_password?: string;

    nick: string;
    realname: string;
    username: string;
}

export const default_config: ConnectionInfo = {
    name: "",
    url: new URL("wss://example.org"),
    secure: false,
    nick: "tubes_user",
    realname: "https://leahc.gay/tubes",
    username: "tubes"
}


// type ProviderDef = {
//     display_name: string,
//     provider: instanceof,
// }

/**
 * A list of providers with a friendly display name.
 */
export const Providers = [
    {
        display_name: "🖥️ Local",
        provider: LocalProvider
    }
]

export enum ProviderError {
    NoConnectionsInProvider = "this provider has no connections in it"
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
export interface iIrcProvider {
    /**
     * Every connection in this provider. Use `connect_all()` to connect to em.
     */
    connections: iIrcConnection[] | null;

    /**
     * The place to check if the provider can use the current environment.
     * 
     * Useful if your provider needs to interact with system apis or
     * browser-specific stuff. If this fails, Tubes will refuse to do anything
     * with this provider.
     */
    supportsEnvironment?: (() => boolean);

    /**
     * Establish a connection to every connection in the `connections` field.
     */
    connect_all(): boolean;
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

    on_connect?: () => void;
    on_msg?: (event: IrcMessageEvent) => void;
}

export interface IrcMessageEvent {
    raw_tags?: string;
    source?: string;
    command: string;
    params: string[];
}