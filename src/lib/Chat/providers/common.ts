import type { IrcMessageEvent } from "../provider+connection";

export function handle_raw_irc_msg(
    raw: string,
    resp: (msg: string) => void
): IrcMessageEvent {
    if (raw.startsWith("PING")) resp(raw.replace("PING", "PONG"));

    let state = raw;

    let raw_tags;
    if (state.trimStart().startsWith("@")) {
        raw_tags = state.substring(0, state.search(" "));
        state = state.replace(raw_tags, "").trimStart();
    }

    let source;
    if (state.trimStart().startsWith(":")) {
        source = state.substring(0, state.search(" "));
        state = state.replace(source, "").trimStart();
    }

    const command = state.trimStart().substring(0, state.search(" "));
    state = state.replace(command, "").trimStart();

    let params: string[] = [];
    const raw_params = state.split(" ");
    for (const param of raw_params) {
        if (param.startsWith(":")) {
            params = [
                ...params,
                // this will always be the last param, so we don't need to do any more
                // work
                state.substring(state.search(" :"), state.length).replace(" :", "")];
            break;
        }

        params = [...params, param];
        state.replace(param, "");
    }

    return {
        raw_tags, source, command, params
    };
}