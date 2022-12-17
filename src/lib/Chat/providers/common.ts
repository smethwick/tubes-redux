import type { IrcMessageEvent } from "../provider+connection";

export function handle_raw_irc_msg(
    raw: string,
    resp: (msg: string) => void
): IrcMessageEvent {
    if (raw.startsWith("PING")) resp(raw.replace("PING", "PONG"));

    let state = raw.trim();
    
    let raw_tags = "";
    let tags;
    if (state.trimStart().startsWith("@")) {
        raw_tags = state.substring(0, state.search(" "));
        state = state.replace(raw_tags, "").trimStart();
        tags = transform_raw_tags(raw_tags);
    }

    let source;
    if (state.trimStart().startsWith(":")) {
        source = state.substring(0, state.search(" "));
        state = state.replace(source, "").trimStart();
        source = source.replace(":", "");
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
                state.substring(state.search(" :"), state.length).replace(" :", "")
            ]; break;
        }

        params = [...params, param];
        state.replace(param, "");
    }

    const timestamp = new Date(Date.now());

    return {
        tags, source, command, params, timestamp
    };
}


export function transform_raw_tags(raw_tags: string) {
    let tags: { key: string, value?: string }[] = [];
    const escaped_values = [
        ['\\:', ";"],
        ["\\s", " "],
        ["\\\\", "\\"],
        ["\\r", "\r"],
        ["\\n", "\n"],
    ]
    
    const split_tags = raw_tags.replace("@", "").split(";");
    
    for (let raw_tag of split_tags) {
        for (const value of escaped_values) raw_tag = raw_tag.replaceAll(value[0], value[1]);
        const [key, value] = raw_tag.split("=");
        tags = [...tags, { key, value }];
    }

    return tags
}
