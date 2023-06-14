import { pick_deterministic } from ".";
import { IrcCommand } from "./Providers/common";
import type { IrcConnection } from "./provider+connection";
import { MessageMatcher, MessageMatcherGroup, Wildcard, group, match } from "./task";

const colours: [string, string, string, string][] = [
    ["text-red-600", "hover:bg-red-50 dark:hover:bg-red-950", "#dc2626", "red"],
    ["text-purple-600", "hover:bg-purple-50 dark:hover:bg-purple-950", "#9333ea", "purple"],
    ["text-pink-600", "hover:bg-pink-50 dark:hover:bg-pink-950", "#db2777", "pink"],
    ["text-amber-600", "hover:bg-amber-50 dark:hover:bg-amber-950", "#d97706", "amber"],
    ["text-yellow-600", "hover:bg-yellow-50 dark:hover:bg-yellow-950", "#ca8a04", "yellow"],
    ["text-lime-600", "hover:bg-lime-50 dark:hover:bg-lime-950", "#65a30d", "lime"],
    ["text-green-600", "hover:bg-green-50 dark:hover:bg-green-950", "#16a34a", "green"],
    ["text-emerald-600", "hover:bg-emerald-50 dark:hover:bg-emerald-950", "#059669", "emerald"],
    ["text-teal-600", "hover:bg-teal-50 dark:hover:bg-teal-950", "#0d9488", "teal"],
    ["text-cyan-600", "hover:bg-cyan-50 dark:hover:bg-cyan-950", "#0891b2", "cyan"],
    ["text-blue-600", "hover:bg-blue-50 dark:hover:bg-blue-950", "#2563eb", "blue"],
    ["text-indigo-600", "hover:bg-indigo-50 dark:hover:bg-indigo-950", "#4f46e5", "indigo"],
    ["text-violet-600", "hover:bg-violet-50 dark:hover:bg-violet-950", "#7c3aed", "violet"],
    ["text-sky-600", "hover:bg-sky-50 dark:hover:bg-sky-950", "#0284c7", "sky"],
    ["text-orange-600", "hover:bg-orange-50 dark:hover:bg-orange-950", "#ea580c", "orange"],
    ["text-fuchsia-600", "hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950", "#c026d3", "fuchsia"],
    ["text-rose-600", "hover:bg-rose-50 dark:hover:bg-rose-950", "#e11d48", "rose"],
]


export type WhoisResponse = {
    host?: string;
    /** the number of seconds the user has been idle for */
    idle_for?: number;
    server?: string;

    nick?: string;
    username?: string;
    realname?: string;

    registered?: boolean;
}

export class Nick {
    color: [string, string, string, string];

    decide_colour = (seed: string) => pick_deterministic(colours, seed);

    async whois(conn: IrcConnection) {
        conn.send_raw(`WHOIS ${this.name}`);
        const msgs = await conn.task_queue.collect(`get WHOIS info for ${this.name}`, {
            start: match(IrcCommand.RPL_WHOISUSER, [Wildcard.Any, this.name]),
            include: group([
                IrcCommand.RPL_WHOISCERTFP,
                IrcCommand.RPL_WHOISREGNICK,
                IrcCommand.RPL_WHOISUSER,
                IrcCommand.RPL_WHOISSERVER,
                IrcCommand.RPL_WHOISOPERATOR,
                IrcCommand.RPL_WHOISIDLE,
                IrcCommand.RPL_WHOISCHANNELS,
                IrcCommand.RPL_WHOISSPECIAL,
                IrcCommand.RPL_WHOISACCOUNT,
                IrcCommand.RPL_WHOISACTUALLY,
                IrcCommand.RPL_WHOISHOST,
                IrcCommand.RPL_WHOISMODES,
                IrcCommand.RPL_WHOISSECURE,
                IrcCommand.RPL_AWAY,
            ].map(o => [o, [Wildcard.Any, this.name]])),
            finish: match(IrcCommand.RPL_ENDOFWHOIS),

            include_start_and_finish: true,
            reject_on: group([
                [IrcCommand.ERR_NOSUCHNICK],
                [IrcCommand.ERR_NOSUCHSERVER],
            ]),
        });

        const user = msgs.find(o => o.command == IrcCommand.RPL_WHOISUSER);

        const nick = user?.params[1];
        const username = user?.params[2];
        const realname = user?.params.last();

        const idle_for =
            Number(msgs.find(o => o.command == IrcCommand.RPL_WHOISIDLE)?.params[2]);
        const server =
            msgs.find(o => o.command == IrcCommand.RPL_WHOISSERVER)?.params[2];
        const host = msgs.find(o => o.command == IrcCommand.RPL_WHOISHOST)?.params.last();
        const registered = Boolean(msgs.find(o => o.command == IrcCommand.RPL_WHOISREGNICK));

        const resp: WhoisResponse = {
            idle_for,
            host,
            server,
            nick,
            username,
            realname,
            registered
        }

        return resp;
    }

    constructor(public name: string) {
        this.color = this.decide_colour(name);
    }
}