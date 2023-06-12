import { Nick } from "./nick";
import type { IrcConnection } from "./provider+connection";

class QueryBuffer {
    nick: Nick;

    constructor(
        private name: string,
        private conn: IrcConnection
    ) { 
        this.nick = new Nick(name);
    }
}