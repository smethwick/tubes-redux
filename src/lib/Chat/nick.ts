import { pick_deterministic } from ".";
import { CommandList } from "./Providers/common";
import type { IrcConnection } from "./provider+connection";
import { Wildcard } from "./task";

const colours: [string, string, string][] = [
    ["text-red-600", "hover:bg-red-50", "#dc2626",],
    ["text-purple-600", "hover:bg-purple-50", "#9333ea",],
    ["text-pink-600", "hover:bg-pink-50", "#db2777",],
    ["text-amber-600", "hover:bg-amber-50", "#d97706",],
    ["text-yellow-600", "hover:bg-yellow-50", "#ca8a04",],
    ["text-lime-600", "hover:bg-lime-50", "#65a30d",],
    ["text-green-600", "hover:bg-green-50", "#16a34a",],
    ["text-emerald-600", "hover:bg-emerald-50", "#059669",],
    ["text-teal-600", "hover:bg-teal-50", "#0d9488",],
    ["text-cyan-600", "hover:bg-cyan-50", "#0891b2",],
    ["text-blue-600", "hover:bg-blue-50", "#2563eb",],
    ["text-indigo-600", "hover:bg-indigo-50", "#4f46e5",],
    ["text-violet-600", "hover:bg-violet-50", "#7c3aed",],
    ["text-sky-600", "hover:bg-sky-50", "#0284c7",],
    ["text-orange-600", "hover:bg-orange-50", "#ea580c",],
    ["text-fuchsia-600", "hover:bg-fuchsia-50", "#c026d3",],
    ["text-rose-600", "hover:bg-rose-50", "#e11d48",],
]

export class Nick {
    color: [string, string, string];

    decide_colour = (seed: string) => pick_deterministic(colours, seed);

    async whois(conn: IrcConnection) {
        conn.send_raw(`WHOIS ${this.name}`);
        const msgs = await conn.task_queue.collect(
            { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISUSER },
            [
                // sometimes programming is bad
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISCERTFP },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISREGNICK },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISUSER },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISSERVER },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISOPERATOR },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISIDLE },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISCHANNELS },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISSPECIAL },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISACCOUNT },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISACTUALLY },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISHOST },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISMODES },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_WHOISSECURE },
                { params: [Wildcard.Any, this.name], command: CommandList.RPL_AWAY },
            ],
            { command: CommandList.RPL_ENDOFWHOIS },
            {
                include_start_and_finish: true,
                reject_on: [
                    { command: CommandList.ERR_NOSUCHNICK },
                    { command: CommandList.ERR_NOSUCHSERVER },
                ],
            },
        );

        return msgs;
    }

    constructor(public name: string) {
        this.color = this.decide_colour(name);
    }
}