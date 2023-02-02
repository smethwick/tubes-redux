import type { LayoutLoad } from "./$types";
import { active_connection, provider } from "$lib/Chat";
import { error } from "@sveltejs/kit";
import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const load: LayoutLoad = async ({ params }) => {
    if (!browser) return;

    await provider.up();

    const { network } = params;
    console.log(network);
    // let connection;

    const connection = provider.get_connection(network);

    if (!connection) {
        throw error(404)
    }

    // active_connection ? active_connection.set(connection[1]) : active_connection = writable(connection[1]);

    return { network, connection }
};