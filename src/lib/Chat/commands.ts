import Fuse from "fuse.js"

export class ClientCommand {
    constructor(
        public name: string,
        public description: string,
        options?: {
            on_activate?: (params: string[]) => Promise<void>,
            params?: { 
                name: string, 
                description: string, 
                required?: boolean 
            }[]
        } 
    ) {

    }
}

export class CommandHandler {    
    static commands: ClientCommand[] = [
        new ClientCommand("me", "display your message as an action"),
        new ClientCommand("join", "join a channel", {
            params: [
                {name: "name", description: "the name of the channel to join", required: true}
            ]
        }),
        new ClientCommand("part", "leave a channel", {
            params: [
                {name: "name", description: "the name of the channel to leave"}
            ]
        }),
        new ClientCommand("query", "open a direct message conversation with someone"),
        new ClientCommand("msg", "send a one-off message to a channel or user"),
    ]

    static fuse = new Fuse(this.commands, {
        keys: ['name']
    });

    static complete(input: string): Fuse.FuseResult<ClientCommand>[] {
        const result = this.fuse.search(input);

        return result
    }

}
