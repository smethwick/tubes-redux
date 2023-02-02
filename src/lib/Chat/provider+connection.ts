import type { Network } from "$lib/Storage/db";
import type { ProviderFlags } from "./flags";
import { handle_raw_irc_msg, type Source } from "./Providers/common";
import { writable, type Writable } from "svelte/store"
import AsyncLock from "async-lock";
import { saveMessage } from "$lib/Storage/messages";
import { TaskQueue } from "./task";
import { Channel } from "./channel";

export interface ConnectionInfo {
    name: string;
    display_name?: string;
    icon: string;

    url: string;
    secure: boolean;
    server_password?: string;

    autojoin: string[];

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
    autojoin: []
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
     * Every connection in this provider. use `connect_all()` to connect to em
     */
    connections: [string, IrcConnection][] = [];

    /**
     * The place to check if the provider can use the current environment.
     * 
     * Useful if your provider needs to interact with system apis or
     * browser-specific stuff. If this fails, Tubes will refuse to do anything
     * with this provider.
     * 
     * @returns true if the environment is acceptable.
     */
    abstract supportsEnvironment?: (() => boolean);

    /**
     * a list of flags for this provider. check {@link ProviderFlags} for a list.
     */
    flags: ProviderFlags[] = [];
    /**
     * check if a flag is set on this provider.
     * 
     * @param flag The flag in question
     * @returns true if the flag is set
     */
    has_flag(flag: ProviderFlags): boolean {
        return this.flags.includes(flag);
    }

    /**
     * true if the network is active
     */
    active = false;
    up_lock = new AsyncLock();

    /**
     * bring the provider up. this is where you should grab stuff 
     * from databases, connect to backend services, that sorta thing.
     */
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

    get_connection(name: string): IrcConnection | undefined {
        const connections = this.get_connections();
        return connections.find(o => o[0] == name)?.[1];
    }

    connection_info_store_for_the_sidebar: Writable<ConnectionInfo[]> = writable();
    get_connections_for_the_sidebar_and_nothing_else(): Writable<ConnectionInfo[]> {
        this.update_sidebar_conns();
        return this.connection_info_store_for_the_sidebar;
    }

    update_sidebar_conns() {
        this.connection_info_store_for_the_sidebar.set(this.connections.map(o => o[1].connection_info));
    }
}


/**
 * A single connection to an IRC network.
 */
export abstract class IrcConnection {
    connection_info: ConnectionInfo;
    isConnected: Writable<boolean | "connecting">;
    channels: Channel[] = [];
    task_queue: TaskQueue = new TaskQueue();

    on_msg?: (event: IrcMessageEvent) => void = e => saveMessage(this.connection_info.name, e);

    constructor(ci: ConnectionInfo) {
        this.isConnected = writable(false);
        this.connection_info = ci;
    }

    abstract connect(): boolean;
    abstract send_raw(msg: string): void;
    abstract disconnect(): void;

    async join_channel(chan: string): Promise<void> {
        this.send_raw(`JOIN ${chan}`);
        await this.task_queue.wait_for("JOIN");
    }

    async privmsg(target: string, msg: string): Promise<void> {
        const connected = this.check_connection();
        if (!connected) throw new Error("not connected");

        this.send_raw(`PRIVMSG ${target} :${msg}`);
        saveMessage(this.connection_info.name, {
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
            null,
            {
                // RPL_MOTD
                only: { command: "372" },
                // RPL_ENDOFMOTD
                until: { command: "376" },
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
                            .map((o) => o.params[o.params.length - 1].substring(2))
                            .join("\n")
                        : "something went wrong");

                    this.motd_gotten = true;
                }
            }
        );
    }

    abstract request_caps: string[];

    capabilities: { cap: string, values: string[] }[] = [];

    async negotiate_capabilities(msg: IrcMessageEvent | undefined): Promise<{ cap: string; values: string[]; }[]> {
        if (!msg) throw new Error("server didn't send caps");

        // this is... not great!
        if (!(msg.params[2] != '*' || msg.params[3])) throw new Error;
        const caps = msg.params[3] || msg.params[2];
        const split_caps = caps.split(" ");
        const res = split_caps.map((o) => {
            const [cap, values] = o.split("=");
            let split_values: string[] = [];
            if (values) split_values = values.split(",");
            return { cap, values: split_values }
        });

        console.log(res)
        for (const cap of this.request_caps) {
            console.log(cap)
            if (res.find((o) => o.cap == cap)) {
                this.send_raw(`CAP REQ :${cap}`);
            }
        }

        return res
    }

    get_channels(): Channel[] {
        return this.channels;
    }

    channel_store: Writable<Channel[]> = writable();
    get_channels_store_edition(): Writable<Channel[]> {
        this.channel_store.set(this.channels);
        return this.channel_store;
    }

    get_channel(name: string): Channel | undefined {
        return this.channels.find((o) => o.name == name);
    }

    setup_channels() {
        this.connection_info.autojoin.forEach((o) => {
            const channel = new Channel(this, o);
            this.channels.push(channel);
        })
        this.channel_store.set(this.channels);
    }

    join_all_channels() {
        this.channels.forEach((o) => {
            o.join();
        })
    }

    handle_open() {
        this.identify();
        this.task_queue.on('001', () => {
            this.get_motd();
            this.join_all_channels();
        });

    }

    handle_incoming(line: string) {
        console.debug("→", line);
        const msg = handle_raw_irc_msg(line, (msg) => {
            this.send_raw(msg)
        });
        this.task_queue.resolve_tasks(msg);
        if (this.on_msg) {
            this.on_msg(msg);
        }
    }

    handle_close(reason?: string) {
        console.info(`Closed connection${reason ? " because " + reason : ""}`, this.connection_info.name)
        this.isConnected.set(false);

    }

    async identify() {
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


    abstract on_connect?: (() => void) | undefined;
}

export interface IrcMessageEvent {
    tags?: { key: string, value?: string }[];
    source?: Source;
    command: string;
    params: string[];
    timestamp: Date;
}