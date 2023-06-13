import type { IrcConnection, RawIrcMessage } from "./provider+connection";

export class FeatureList {
    features: Feature[] = [];

    constructor(private conn: IrcConnection) { }

    async process_isupport(data: RawIrcMessage) {
        //
    }
}

export class Feature {
    constructor(public key: string, public value: string) { }
};