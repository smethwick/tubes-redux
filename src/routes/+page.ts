import { provider } from "$lib/Chat";
import { LocalProvider } from "$lib/Chat/Providers/local";
import { z } from 'zod';
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { IrcCommand } from "$lib/Chat/Providers/common";
import { Params } from "$lib/Chat/provider+connection";

const is_redirect = z.object({
    location: z.string(),
}).partial();

const is_irc_resp = z.object({
    "command": z.string(),
    "params": z.array(z.string())
}).partial();

export const load: PageLoad = async () => {
    try {
        await provider.up();
        const networks = await provider.get_connections();
        if (networks.length == 0) throw redirect(302, `/setup`);
        const name = networks[0][0];
        throw redirect(302, `/${name}/home`);
    } catch (e) {
        {
            const parsed = await is_redirect.safeParseAsync(e);
            if (parsed.success) throw e;
        }

        {
            console.log(e);
            const parsed = await is_irc_resp.safeParseAsync(JSON.parse(String(e)));
            if (parsed.success && parsed.data.command == IrcCommand.ERR_SASLFAIL) {
                throw redirect(302, `/setup/tubinate?error=${encodeURIComponent(
                    parsed.data.params?.at(-1) ?? "Invalid username or password")
                    }`)
            }
        }

        throw redirect(302, `/setup/tubinate?error=${encodeURIComponent(String(e))}`)
    }
};