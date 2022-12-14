import { type iIrcProvider, type iIrcConnection, type ConnectionInfo, ProviderError } from "../provider+connection";

export class LocalProvider implements iIrcProvider {
    connections: LocalIrcConnection[] | null = null;

    connect_all() {
        let result = true;

        if (this.connections) {
            for (const connection of this.connections) {
                const connection_result = connection.connect();

                // return false if any connection fails.
                if (result == true) {
                    result = connection_result;
                }
            }
        } else {
            throw new Error(ProviderError.NoConnectionsInProvider)
        }

        return result;
    }
}

class LocalIrcConnection implements iIrcConnection {
    connection_info: ConnectionInfo;
    writer: ReadableStream<string>;
    sender: WritableStream<string>;

    constructor(ci: ConnectionInfo) {
        this.writer = new ReadableStream;
        this.sender = new WritableStream;
        this.connection_info = ci;
    }

    connect() {
        throw new Error("not yet implemented");
        return true;
    }
}