import type { IrcConnection, IrcMessageEvent } from "./provider+connection";

export class FeatureList {
    features: Feature[] = [];

    constructor(private conn: IrcConnection) { }

    async process_isupport(data: IrcMessageEvent) {
        //
    }
}

export class Feature {
    constructor(public key: string, public value: string) { }
};