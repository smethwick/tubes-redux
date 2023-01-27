import type { Network } from "$lib/Storage/db";
import type { Capability } from "./caps";
import type { Source } from "./Providers/common";
import { writable, type Writable } from "svelte/store"
import AsyncLock from "async-lock";
import { saveMessage } from "$lib/Storage/messages";
import { TaskQueue } from "./task";

export interface ConnectionInfo {
    name: string;
    display_name?: string;
    icon: string;

    url: string;
    secure: boolean;
    server_password?: string;

    channels: string[];

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
    username: "tubes",
    channels: []
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
 * ## An IRC Provider
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
export abstract class IrcProvider {
    /**
     * Every connection in this provider. Use `connect_all()` to connect to em.
     */
    connections: [string, IrcConnection][] = [];

    /**
     * The place to check if the provider can use the current environment.
     * 
     * Useful if your provider needs to interact with system apis or
     * browser-specific stuff. If this fails, Tubes will refuse to do anything
     * with this provider.
     */
    abstract supportsEnvironment?: (() => boolean);

    capabilities: Capability[] = [];
    supports(cap: Capability): boolean {
        return this.capabilities.includes(cap);
    }

    active = false;
    up_lock = new AsyncLock();
    abstract up(): void;
    abstract down?(): void;

    /**
     * Establish a connection to every connection in the `connections` field.
     */
    connect_all(): boolean {
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

    abstract add_connection?(ci: ConnectionInfo): IrcConnection
    abstract add_persistent_connection?(ci: ConnectionInfo): IrcConnection
    static fetch_persistent_connections?(provider_id: string): Promise<Network[]>
    abstract get_connections(): [string, IrcConnection][];
}


/**
 * A single connection to an IRC network.
 */
export abstract class IrcConnection {
    connection_info: ConnectionInfo;
    isConnected: Writable<boolean | "connecting">;
    channels: (string | "server_msgs")[] = [];
    task_queue: TaskQueue = new TaskQueue();

    on_msg?: (event: IrcMessageEvent) => void = saveMessage;

    constructor(ci: ConnectionInfo) {
        this.isConnected = writable(false);
        this.connection_info = ci;
    }

    abstract connect(): boolean;
    abstract send_raw(msg: string): void;
    abstract disconnect(): void;

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

    abstract on_connect?: (() => void) | undefined;
}

export interface IrcMessageEvent {
    tags?: { key: string, value?: string }[];
    source?: Source;
    command: string;
    params: string[];
    timestamp: Date;
}