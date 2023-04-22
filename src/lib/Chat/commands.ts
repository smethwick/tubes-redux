import Fuse from "fuse.js"
import type { IrcConnection } from "./provider+connection";

export class ClientCommand {
    on_activate?: (target: string, params: string[], connection: IrcConnection) => Promise<void>;

    constructor(
        public name: string,
        public description: string,
        options?: {
            on_activate?: (target: string, params: string[], connection: IrcConnection) => Promise<void>,
            params?: {
                name: string,
                description: string,
                required?: boolean
            }[]
        }
    ) {
        this.on_activate = options?.on_activate;
    }
}

export class CommandHandler {
    static commands: ClientCommand[] = [
        new ClientCommand("me", "display your message as an action", {
            on_activate: async (tgt, params, conn) => {
                conn.privmsg(tgt, `\x01ACTION ${params.join(" ")}\x01`);
            },
        }),
        new ClientCommand("join", "join a channel", {
            params: [
                { name: "name", description: "the name of the channel to join", required: true }
            ]
        }),
        new ClientCommand("part", "leave a channel", {
            params: [
                { name: "name", description: "the name of the channel to leave" }
            ]
        }),
        new ClientCommand("query", "open a direct message conversation with someone"),
        new ClientCommand("msg", "send a one-off message to a channel or user"),
        new ClientCommand("quote", "send a raw and uncensored irc message to the server", {
            async on_activate(_target, params, connection) {
                connection.send_raw(params.join(" "));
            },
        })
    ]

    static fuse = new Fuse(this.commands, {
        keys: ['name']
    });

    static complete(input: string): Fuse.FuseResult<ClientCommand>[] {
        const result = this.fuse.search(input);

        return result
    }

    static async run(input: string, target: string, conn: IrcConnection) {
        if (input.startsWith("/")) input = input.replace("/", "");
        const [command_name, ...params] = input.split(" ");

        const command = this.commands.find(o => o.name == command_name);
        if (!command || !command.on_activate) throw "No such command";

        command.on_activate(target, params, conn);
    }
}
