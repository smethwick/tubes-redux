import type { IrcConnection } from "./provider+connection";

// This is expected to change when the chathistory extensions
// stops being a draft
const CAP_NAME = "draft/chathistory";

type C_Timestamp = ["timestamp", Date] | ["msg_id", string];

export class ChatFrame {
    constructor(private conn: IrcConnection) { }

    static async fromIdxDb() {
        //
    }

    static async fromChatHistory(
        conn: IrcConnection,
        before: C_Timestamp,
        target: string,
        limit: number
    ): Promise<ChatFrame> {
        if (!conn.capman.hasCap(CAP_NAME)) 
            throw new Error("This connection doesn't support chathistory");
        
        throw new Error;
    }
}