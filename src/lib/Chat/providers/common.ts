import type { IrcMessageEvent } from "../provider+connection";

export async function handle_raw_irc_msg(
    raw: string,
    resp: (msg: string) => void
): Promise<IrcMessageEvent | null | undefined> {
    if (raw.startsWith("PING")) resp(raw.replace("PING", "PONG"));
    
    const msg_parts = raw.split(" ");



    return null;
}