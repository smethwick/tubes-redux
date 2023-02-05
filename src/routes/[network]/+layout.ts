import type { LayoutLoad } from "./$types";
import { current_style, provider } from "$lib/Chat";
import { error } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ params, url }) => {
    await provider.up();

    const { network } = params;

    const connection = provider.get_connection(network);
    if (!connection) throw error(404);

    current_style.set(connection.styles);

    connection.last_url = url.toString();
    // this is probably not the best idea oops oh well
    provider.get_connections_for_the_sidebar_and_nothing_else();

    return { network, connection }
};