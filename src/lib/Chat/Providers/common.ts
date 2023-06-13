import { Params, type RawIrcMessage } from "../provider+connection";

export function handle_raw_irc_msg(
    raw: string,
    resp: (msg: string) => void
): RawIrcMessage {
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
        source = transform_user_line(source);
    }

    const command = state.trimStart().substring(0, state.search(" "));

    state = state.replace(command, "").trimStart();

    const params: Params = new Params();
    const raw_params = state.split(" ");
    for (const param of raw_params) {
        if (param.startsWith(":")) {
            params.push(state.substring(state.search(" :"), state.length).trimStart().replace(":", "")
            ); break;
        }

        params.push(param);
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

export type Source = servername | userline;
type servername = [name: string];
type userline = [nickname: string, username: string, hostname: string];

export function transform_user_line(source: string): Source {
    if (source.includes("!") || source.includes("@")) {
        const [nickname, therest] = source.split("!");
        const [username, hostname] = therest.split("@");

        return [nickname, username, hostname];
    } else {
        return [source]
    }
}


export enum CommandList {
    UNKNOWN = "???",
    PRIVMSG = "PRIVMSG",
    RPL_WELCOME = "001",
    RPL_YOURHOST = "002",
    RPL_CREATED = "003",
    RPL_MYINFO = "004",
    RPL_ISUPPORT = "005",
    RPL_BOUNCE = "010",
    RPL_UMODEIS = "221",
    RPL_LUSERCLIENT = "251",
    RPL_LUSEROP = "252",
    RPL_LUSERUNKNOWN = "253",
    RPL_LUSERCHANNELS = "254",
    RPL_LUSERME = "255",
    RPL_ADMINME = "256",
    RPL_ADMINLOC1 = "257",
    RPL_ADMINLOC2 = "258",
    RPL_ADMINEMAIL = "259",
    RPL_TRYAGAIN = "263",
    RPL_LOCALUSERS = "265",
    RPL_GLOBALUSERS = "266",
    RPL_WHOISCERTFP = "276",
    RPL_NONE = "300",
    RPL_AWAY = "301",
    RPL_USERHOST = "302",
    RPL_UNAWAY = "305",
    RPL_NOWAWAY = "306",
    RPL_WHOREPLY = "352",
    RPL_ENDOFWHO = "315",
    RPL_WHOISREGNICK = "307",
    RPL_WHOISUSER = "311",
    RPL_WHOISSERVER = "312",
    RPL_WHOISOPERATOR = "313",
    RPL_WHOWASUSER = "314",
    RPL_WHOISIDLE = "317",
    RPL_ENDOFWHOIS = "318",
    RPL_WHOISCHANNELS = "319",
    RPL_WHOISSPECIAL = "320",
    RPL_LISTSTART = "321",
    RPL_LIST = "322",
    RPL_LISTEND = "323",
    RPL_CHANNELMODEIS = "324",
    RPL_CREATIONTIME = "329",
    RPL_WHOISACCOUNT = "330",
    RPL_NOTOPIC = "331",
    RPL_TOPIC = "332",
    RPL_TOPICWHOTIME = "333",
    RPL_INVITELIST = "336",
    RPL_ENDOFINVITELIST = "337",
    RPL_WHOISACTUALLY = "338",
    RPL_INVITING = "341",
    RPL_INVEXLIST = "346",
    RPL_ENDOFINVEXLIST = "347",
    RPL_EXCEPTLIST = "348",
    RPL_ENDOFEXCEPTLIST = "349",
    RPL_VERSION = "351",
    RPL_NAMREPLY = "353",
    RPL_ENDOFNAMES = "366",
    RPL_LINKS = "364",
    RPL_ENDOFLINKS = "365",
    RPL_BANLIST = "367",
    RPL_ENDOFBANLIST = "368",
    RPL_ENDOFWHOWAS = "369",
    RPL_INFO = "371",
    RPL_ENDOFINFO = "374",
    RPL_MOTDSTART = "375",
    RPL_MOTD = "372",
    RPL_ENDOFMOTD = "376",
    RPL_WHOISHOST = "378",
    RPL_WHOISMODES = "379",
    RPL_YOUREOPER = "381",
    RPL_REHASHING = "382",
    RPL_TIME = "391",
    ERR_UNKNOWNERROR = "400",
    ERR_NOSUCHNICK = "401",
    ERR_NOSUCHSERVER = "402",
    ERR_NOSUCHCHANNEL = "403",
    ERR_CANNOTSENDTOCHAN = "404",
    ERR_TOOMANYCHANNELS = "405",
    ERR_WASNOSUCHNICK = "406",
    ERR_NOORIGIN = "409",
    ERR_INPUTTOOLONG = "417",
    ERR_UNKNOWNCOMMAND = "421",
    ERR_NOMOTD = "422",
    ERR_ERRONEUSNICKNAME = "432",
    ERR_NICKNAMEINUSE = "433",
    ERR_USERNOTINCHANNEL = "441",
    ERR_NOTONCHANNEL = "442",
    ERR_USERONCHANNEL = "443",
    ERR_NOTREGISTERED = "451",
    ERR_NEEDMOREPARAMS = "461",
    ERR_ALREADYREGISTERED = "462",
    ERR_PASSWDMISMATCH = "464",
    ERR_YOUREBANNEDCREEP = "465",
    ERR_CHANNELISFULL = "471",
    ERR_UNKNOWNMODE = "472",
    ERR_INVITEONLYCHAN = "473",
    ERR_BANNEDFROMCHAN = "474",
    ERR_BADCHANNELKEY = "475",
    ERR_BADCHANMASK = "476",
    ERR_NOPRIVILEGES = "481",
    ERR_CHANOPRIVSNEEDED = "482",
    ERR_CANTKILLSERVER = "483",
    ERR_NOOPERHOST = "491",
    ERR_UMODEUNKNOWNFLAG = "501",
    ERR_USERSDONTMATCH = "502",
    ERR_HELPNOTFOUND = "524",
    ERR_INVALIDKEY = "525",
    RPL_STARTTLS = "670",
    RPL_WHOISSECURE = "671",
    ERR_STARTTLS = "691",
    ERR_INVALIDMODEPARAM = "696",
    RPL_HELPSTART = "704",
    RPL_HELPTXT = "705",
    RPL_ENDOFHELP = "706",
    ERR_NOPRIVS = "723",
    RPL_LOGGEDIN = "900",
    RPL_LOGGEDOUT = "901",
    ERR_NICKLOCKED = "902",
    RPL_SASLSUCCESS = "903",
    ERR_SASLFAIL = "904",
    ERR_SASLTOOLONG = "905",
    ERR_SASLABORTED = "906",
    ERR_SASLALREADY = "907",
    RPL_SASLMECHS = "908",
}