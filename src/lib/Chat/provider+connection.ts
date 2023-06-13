import { db, type Network } from "$lib/Storage/db";
import { ProviderFlags } from "./flags";
import { handle_raw_irc_msg, type Source } from "./Providers/common";
import { writable, type Writable } from "svelte/store"
import AsyncLock from "async-lock";
import { saveMessage, turnIntoSomethingUseful } from "$lib/Storage/messages";
import { Deferred, TaskQueue, Wildcard } from "./task";
import { Channel } from "./channel";
import { pick_deterministic } from ".";
import { Capability, CapabilityManager } from "./caps";
import { v4 as uuidv4 } from 'uuid';
import { Saslinator, type SaslMethod } from "./sasl";

export interface ConnectionInfo {
    name: string;
    display_name?: string;
    icon?: string;

    url: string;
    secure: boolean;
    server_password?: string;

    autojoin: string[];

    nick: string;
    realname: string;
    username: string;

    sasl?: SaslMethod;
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
    abstract friendly_name: string;

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

    abstract supported_protos: ("ws" | "wss" | "ircs" | "irc")[];

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
    async connect_all(): Promise<boolean> {
        let result = true;
        if (this.connections) {
            for (const connection of this.connections) {
                const connection_result = await connection[1].connect();

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


    abstract add_connection?(ci: ConnectionInfo): Promise<IrcConnection>
    abstract add_persistent_connection?(ci: ConnectionInfo): Promise<IrcConnection>
    static fetch_persistent_connections?(provider_id: string): Promise<Network[]>
    abstract get_connections(): Promise<[string, IrcConnection][]>;

    async get_connection(name: string): Promise<IrcConnection | undefined> {
        const connections = await this.get_connections();
        return connections.find(o => o[0] == name)?.[1];
    }

    connection_info_store_for_the_sidebar: Writable<(ConnectionInfo & { last_url: string, styles: conn_styles })[]> = writable();
    get_connections_for_the_sidebar_and_nothing_else(): Writable<(ConnectionInfo & { last_url: string, styles: conn_styles })[]> {
        this.update_sidebar_conns();
        return this.connection_info_store_for_the_sidebar;
    }

    update_sidebar_conns() {
        this.connection_info_store_for_the_sidebar.set(this.connections.map(o => {
            const ci = o[1].connection_info;
            return { ...ci, last_url: o[1].last_url, styles: o[1].styles };
        }));
    }
}

export type conn_styles = {
    color_name: string,
    chan_selected: string,
    chan_inactive: string,
    net_selected: string,
    net_inactive: string
};

const color_names = [
    "red",
    "indigo",
    "violet",
    "yellow",
    "sky",
    "fuchsia",
    "purple",
    "cyan",
    "emerald",
    "teal",
    "amber",
    "orange",
    "lime",
    "green",
    "blue",
    "pink",
    "rose"
];

const colours = (): conn_styles[] => {
    return color_names.map((o) =>
    ({
        color_name: o,
        chan_selected: `bg-${o}-300 hover:bg-${o}-300 dark:bg-${o}-800 dark:hover:bg-${o}-800`,
        chan_inactive: `hover:bg-${o}-500/10`,
        net_selected: `bg-${o}-300 dark:bg-${o}-800`,
        net_inactive: `bg-${o}-100 hover:bg-${o}-200 dark:bg-${o}-900 dark:hover:bg-${o}-700`
    })
    )
}

/**
 * A single connection to an IRC network.
 */
export abstract class IrcConnection {
    isConnected: Writable<boolean | "connecting">;
    pinger = new Pinger(this);

    channels: Channel[] = [];
    channel_store: Writable<Channel[]> = writable();

    task_queue: TaskQueue = new TaskQueue();

    last_url: string;
    styles: conn_styles;

    abstract requested_caps: string[];
    capman: CapabilityManager = new CapabilityManager(this);
    saslinator: Saslinator;

    motd: Writable<string> = writable("");
    motd_gotten = false;

    nick = "";

    on_msg?: (event: RawIrcMessage) => void = e =>
        this.provider.has_flag(ProviderFlags.StoreLogs)
            ? saveMessage(this.connection_info.name, e)
            : null;

    constructor(
        public connection_info: ConnectionInfo,
        public provider: IrcProvider,
    ) {
        this.isConnected = writable(false);
        this.last_url = `/${this.connection_info.name}`;
        this.styles = pick_deterministic<conn_styles>(
            colours(),
            this.connection_info.display_name ?? this.connection_info.name
        );
        this.saslinator = new Saslinator(this, this.connection_info.sasl);
    }

    abstract connect(): Promise<boolean>;
    abstract send_raw(msg: string): void;
    abstract disconnect(): void;

    async join_channel(chan: string): Promise<void> {
        const channel = new Channel(this, chan);
        this.channels.push(channel);
        this.channel_store.set(this.channels);
        channel.join();
        await this.task_queue.wait_for({ command: "JOIN" });
    }

    async join_persistent_channel(chan: string): Promise<void> {
        await this.join_channel(chan);
        const entry = await db.networks.where("name").equals(this.connection_info.name).first();
        if (!entry || !entry.id) throw new Error("no such network");
        db.networks.update(entry.id, {
            ...entry, conn_blueprint: {
                // lmao
                ...entry.conn_blueprint, autojoin: [...entry.conn_blueprint.autojoin, chan]
            }
        });
        await this.save_connection_info(entry.name);
    }

    async update_connection_info(ci: ConnectionInfo) {
        const entry = await db.networks.where("name").equals(this.connection_info.name).first();
        if (!entry || !entry.id) throw new Error("no such network");
        db.networks.update(entry.id, {
            ...entry, name: ci.name, conn_blueprint: ci
        });

        await this.save_connection_info(entry.name);
    }

    async save_connection_info(name: string) {
        const entry = await db.networks.where("name").equals(name).first();
        if (!entry || !entry.conn_blueprint) throw new Error("no such network");
        this.connection_info = entry.conn_blueprint;
    }

    async privmsg(target: string, msg: string): Promise<string | void> {
        const connected = this.check_connection();
        if (!connected) throw new Error("not connected");

        let label: string | undefined;

        if (this.capman.hasCap("labeled-response")) {
            label = uuidv4();
            this.send_raw(`@label=${label} PRIVMSG ${target} :${msg}`);
        } else {
            this.send_raw(`PRIVMSG ${target} :${msg}`);
        }

        if (this.provider.has_flag(ProviderFlags.StoreLogs)) saveMessage(this.connection_info.name, {
            command: "PRIVMSG",
            params: new Params(target, msg),
            timestamp: new Date(Date.now()),
            source: [this.connection_info.nick, this.connection_info.username, "localhost"],
        });

        return label;
    }

    check_connection(): boolean {
        let connected;
        const unsub = this.isConnected.subscribe((value) => {
            connected = value;
        })
        unsub();

        return connected == true
    }

    async get_motd() {
        if (this.motd_gotten) return;
        this.send_raw("MOTD");

        const collected = await this.task_queue.collect(
            // RPL_MOTDSTART
            { command: "375" },
            // RPL_MOTD
            [{ command: "372" }],
            // RPL_ENDOFMOTD
            { command: "376" },
            {
                // ERR_NOSUCHSERVER and ERR_NOMOTD respectively
                reject_on: [{ command: "402" }, /* { command: "422" } */]
            }
        )

        // update the store when everything's been recieved
        this.motd.set(collected
            ? collected
                .map((o) => {
                    const param = o.params.at(-1)!;
                    return param.startsWith("- ") ? param.substring(2).trim() : param;
                })
                .join("\n")
            : "something went wrong");

        this.motd_gotten = true;
    }

    get_channels(): Channel[] {
        return this.channels;
    }

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


    async handle_open() {
        await this.identify();
        this.get_motd();
        this.join_all_channels();
        this.pinger.start();
    }

    async handle_incoming(line: string, conn_name?: string) {
        const msg = handle_raw_irc_msg(line, (msg) => {
            this.send_raw(msg)
        });
        // the if here is a quick and dirty performance hack, sorry
        if (msg.command != "322") console.debug(conn_name ? `${conn_name} →` : "→", line);
        // notify any tasks that are listening out for a matching message
        await this.task_queue.resolve_tasks(msg);
        // for when the provider needs to do anything with the message
        if (this.on_msg) this.on_msg(msg);

        // i have forgotten what this was for so i've commented it out.
        // if (msg.tags?.find(e => e.key == "batch")) return;

        // turn the message into something we can use in the ui
        const parsed = await turnIntoSomethingUseful(this.connection_info.name, msg);
        // if there isn't anything worth doing just return here
        if (!parsed) return;
        // push the message into the channel's session buffer if it exists
        this.channels.find(e => e.name == parsed.target)?.session.push(parsed);
    }

    handle_close(reason?: string) {
        console.info(`Closed connection${reason ? " because " + reason : ""}`, this.connection_info.name)
        this.channels.forEach(o => o.cleanup());
        this.pinger.stop()
        this.channels = [];
        this.channel_store.set([]);
        this.isConnected.set(false);
    }

    async identify(ci?: ConnectionInfo, postreg?: () => Promise<void>) {
        if (!ci) ci = this.connection_info;

        const to_send = [
            ci.server_password ? `PASS ${ci.server_password}` : ``,
            `NICK ${ci.nick}`,
            `USER ${ci.username} 0 * :${ci.realname}`,
        ];

        await this.capman.negotiate();

        for (const msg of to_send) {
            if (msg) this.send_raw(msg);
        }

        if (this.capman.hasCap("sasl") && ci.sasl)
            await this.saslinator.authenticate();

        if (postreg) await postreg();

        this.send_raw("CAP END");

        const welcome = await this.task_queue.wait_for("001", {
            reject_on: [
                { command: "431" },
                { command: "432" },
                { command: "433" },
                { command: "436" },
            ]
        }).catch(e => { throw new Error(e) });

        this.nick = welcome.params[0];

        this.isConnected.set(true)
    }


    abstract on_connect?: (() => void) | undefined;
}

export interface RawIrcMessage {
    tags?: { key: string, value?: string }[];
    source?: Source;
    command: string;
    params: Params;
    timestamp: Date;
}

export class Params extends Array<string> {
    last(): string {
        return this.at(-1)!;
    }

    static get [Symbol.species]() {
        return Array;
    }
}

export class Pinger {
    constructor(private conn: IrcConnection) { }

    pinging = false;

    async start() {
        this.pinging = true;
        this.ping();
    }

    async stop() {
        this.pinging = false;
    }

    async ping() {
        setTimeout(async () => {
            this.conn.send_raw("PING tubes");
            const msg = await this.conn.task_queue.wait_for({ command: "PONG", params: [Wildcard.Any, 'tubes'] });

            // if we don't get a response after 30 seconds, assume the connection is dead.
            setTimeout(() => {
                if (!msg) this.conn.disconnect();
            }, 30000);

            if (this.pinging) this.ping()
        }, 30000);
    }
}
