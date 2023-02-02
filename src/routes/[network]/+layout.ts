import type { LayoutLoad } from "./$types";
import { active_connection, provider } from "$lib/Chat";
import { error } from "@sveltejs/kit";
import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const load: LayoutLoad = async ({ params }) => {
    await provider.up();

    const { network } = params;
    
    const connection = provider.get_connection(network);
    if (!connection) throw error(404);

    return { network, connection }
};