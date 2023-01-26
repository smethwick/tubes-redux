import { IrcConnection, IrcProvider, type ConnectionInfo } from "../provider+connection";

export class SojuProvider extends IrcProvider {
    supportsEnvironment?: (() => boolean) | undefined;
    up(): void {
        throw new Error("Method not implemented.");
    }
    down?(): void {
        throw new Error("Method not implemented.");
    }
    add_connection?(ci: ConnectionInfo): IrcConnection {
        throw new Error("Method not implemented.");
    }
    add_persistent_connection?(ci: ConnectionInfo): IrcConnection {
        throw new Error("Method not implemented.");
    }
}

export class SojuConnection extends IrcConnection {
    connect(): boolean {
        throw new Error("Method not implemented.");
    }
    send_raw(msg: string): void {
        throw new Error("Method not implemented.");
    }
    disconnect(): void {
        throw new Error("Method not implemented.");
    }
    on_connect?: (() => void) | undefined;

}