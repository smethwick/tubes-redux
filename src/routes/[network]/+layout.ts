import type { LayoutLoad } from "./$types";
import { provider } from "$lib/Chat";
import { error } from "@sveltejs/kit";
import { browser } from "$app/environment";

export const load: LayoutLoad = async ({ params }) => {
    if (!browser) return;
    
    const { network } = params;
    // let connection;

    // const unsubscribe = provider.subscribe(async (value) => {
    //     await value.up();

    //     connection = value.connections.find((o) => o[0] == network);

    //     if (!connection) {
    //         throw error(404)
    //     }
    
    // });

    // unsubscribe();

    return {network}
};