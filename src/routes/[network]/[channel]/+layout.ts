import { error, redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, params }) => {
    const data = await parent();

    if (!data.connection) throw error(404);

    const channel_name = decodeURIComponent(params.channel);
    const channel = data.connection.get_channel(channel_name);
    if (!channel) throw redirect(302, "./home");

    return { ...data, channel };
};