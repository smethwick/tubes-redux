import type { IrcMessageEvent } from "../provider+connection";

export function handle_raw_irc_msg(
    raw: string,
    resp: (msg: string) => void
): IrcMessageEvent {
    if (raw.startsWith("PING")) resp(raw.replace("PING", "PONG"));

    let state = raw.trimStart();

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

// export const CommandName = {
//     "PRIVMSG": "PRIVMSG",
//     "001": "RPL_WELCOME",
//     "002": "RPL_YOURHOST",
//     "003": "RPL_CREATED",
//     "004": "RPL_MYINFO",
//     "005": "RPL_ISUPPORT",
//     "010": "RPL_BOUNCE",
//     "221": "RPL_UMODEIS",
//     "251": "RPL_LUSERCLIENT",
//     "252": "RPL_LUSEROP",
//     "253": "RPL_LUSERUNKNOWN",
//     "254": "RPL_LUSERCHANNELS",
//     "255": "RPL_LUSERME",
//     "256": "RPL_ADMINME",
//     "257": "RPL_ADMINLOC1",
//     "258": "RPL_ADMINLOC2",
//     "259": "RPL_ADMINEMAIL",
//     "263": "RPL_TRYAGAIN",
//     "265": "RPL_LOCALUSERS",
//     "266": "RPL_GLOBALUSERS",
//     "276": "RPL_WHOISCERTFP",
//     "300": "RPL_NONE",
//     "301": "RPL_AWAY",
//     "302": "RPL_USERHOST",
//     "305": "RPL_UNAWAY",
//     "306": "RPL_NOWAWAY",
//     "352": "RPL_WHOREPLY",
//     "315": "RPL_ENDOFWHO",
//     "307": "RPL_WHOISREGNICK",
//     "311": "RPL_WHOISUSER",
//     "312": "RPL_WHOISSERVER",
//     "313": "RPL_WHOISOPERATOR",
//     "314": "RPL_WHOWASUSER",
//     "317": "RPL_WHOISIDLE",
//     "318": "RPL_ENDOFWHOIS",
//     "319": "RPL_WHOISCHANNELS",
//     "320": "RPL_WHOISSPECIAL",
//     "321": "RPL_LISTSTART",
//     "322": "RPL_LIST",
//     "323": "RPL_LISTEND",
//     "324": "RPL_CHANNELMODEIS",
//     "329": "RPL_CREATIONTIME",
//     "330": "RPL_WHOISACCOUNT",
//     "331": "RPL_NOTOPIC",
//     "332": "RPL_TOPIC",
//     "333": "RPL_TOPICWHOTIME",
//     "336": "RPL_INVITELIST",
//     "337": "RPL_ENDOFINVITELIST",
//     "338": "RPL_WHOISACTUALLY",
//     "341": "RPL_INVITING",
//     "346": "RPL_INVEXLIST",
//     "347": "RPL_ENDOFINVEXLIST",
//     "348": "RPL_EXCEPTLIST",
//     "349": "RPL_ENDOFEXCEPTLIST",
//     "351": "RPL_VERSION",
//     "353": "RPL_NAMREPLY",
//     "366": "RPL_ENDOFNAMES",
//     "364": "RPL_LINKS",
//     "365": "RPL_ENDOFLINKS",
//     "367": "RPL_BANLIST",
//     "368": "RPL_ENDOFBANLIST",
//     "369": "RPL_ENDOFWHOWAS",
//     "371": "RPL_INFO",
//     "374": "RPL_ENDOFINFO",
//     "375": "RPL_MOTDSTART",
//     "372": "RPL_MOTD",
//     "376": "RPL_ENDOFMOTD",
//     "378": "RPL_WHOISHOST",
//     "379": "RPL_WHOISMODES",
//     "381": "RPL_YOUREOPER",
//     "382": "RPL_REHASHING",
//     "391": "RPL_TIME",
//     "400": "ERR_UNKNOWNERROR",
//     "401": "ERR_NOSUCHNICK",
//     "402": "ERR_NOSUCHSERVER",
//     "403": "ERR_NOSUCHCHANNEL",
//     "404": "ERR_CANNOTSENDTOCHAN",
//     "405": "ERR_TOOMANYCHANNELS",
//     "406": "ERR_WASNOSUCHNICK",
//     "409": "ERR_NOORIGIN",
//     "417": "ERR_INPUTTOOLONG",
//     "421": "ERR_UNKNOWNCOMMAND",
//     "422": "ERR_NOMOTD",
//     "432": "ERR_ERRONEUSNICKNAME",
//     "433": "ERR_NICKNAMEINUSE",
//     "441": "ERR_USERNOTINCHANNEL",
//     "442": "ERR_NOTONCHANNEL",
//     "443": "ERR_USERONCHANNEL",
//     "451": "ERR_NOTREGISTERED",
//     "461": "ERR_NEEDMOREPARAMS",
//     "462": "ERR_ALREADYREGISTERED",
//     "464": "ERR_PASSWDMISMATCH",
//     "465": "ERR_YOUREBANNEDCREEP",
//     "471": "ERR_CHANNELISFULL",
//     "472": "ERR_UNKNOWNMODE",
//     "473": "ERR_INVITEONLYCHAN",
//     "474": "ERR_BANNEDFROMCHAN",
//     "475": "ERR_BADCHANNELKEY",
//     "476": "ERR_BADCHANMASK",
//     "481": "ERR_NOPRIVILEGES",
//     "482": "ERR_CHANOPRIVSNEEDED",
//     "483": "ERR_CANTKILLSERVER",
//     "491": "ERR_NOOPERHOST",
//     "501": "ERR_UMODEUNKNOWNFLAG",
//     "502": "ERR_USERSDONTMATCH",
//     "524": "ERR_HELPNOTFOUND",
//     "525": "ERR_INVALIDKEY",
//     "670": "RPL_STARTTLS",
//     "671": "RPL_WHOISSECURE",
//     "691": "ERR_STARTTLS",
//     "696": "ERR_INVALIDMODEPARAM",
//     "704": "RPL_HELPSTART",
//     "705": "RPL_HELPTXT",
//     "706": "RPL_ENDOFHELP",
//     "723": "ERR_NOPRIVS",
//     "900": "RPL_LOGGEDIN",
//     "901": "RPL_LOGGEDOUT",
//     "902": "ERR_NICKLOCKED",
//     "903": "RPL_SASLSUCCESS",
//     "904": "ERR_SASLFAIL",
//     "905": "ERR_SASLTOOLONG",
//     "906": "ERR_SASLABORTED",
//     "907": "ERR_SASLALREADY",
//     "908": "RPL_SASLMECHS",
// } as const;