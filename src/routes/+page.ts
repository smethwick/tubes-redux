import { provider } from "$lib/Chat";
import { LocalProvider } from "$lib/Chat/Providers/local";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    await provider.up();
    const networks = await provider.get_connections();
    if (networks.length == 0) throw redirect(302, `/setup`);
    
    const name = networks[0][0];

    throw redirect(302, `/${name}/home`);
};