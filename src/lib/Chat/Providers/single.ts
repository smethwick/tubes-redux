import type { ProviderFlags } from "../flags";
import type { ConnectionInfo } from "../provider+connection";
import { LocalIrcConnection, LocalProvider } from "./local";

export class SingleConnectionProvider extends LocalProvider {
    flags: ProviderFlags[] = [];

    constructor(public ci: ConnectionInfo) {
        super();
    }

    async up() {
        if (this.active) return;
        await this.up_lock.acquire("up-lock", async () => {
            if (this.active) return;
            this.connections.push([this.ci.name, new LocalIrcConnection(this.ci)]);
            this.active = true;
        })
    }
}