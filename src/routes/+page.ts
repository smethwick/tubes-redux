import { provider } from "$lib/Chat";
import { LocalProvider } from "$lib/Chat/Providers/local";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const networks = await LocalProvider.fetch_persistent_connections('LocalProvider');
    if (networks.length == 0) throw redirect(302, `/setup`);
    
    const [{conn_blueprint: {name}}] = networks;

    throw redirect(302, `/${name}/home`);
};