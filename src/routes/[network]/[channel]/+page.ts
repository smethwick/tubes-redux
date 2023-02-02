import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const data = await parent();

    const channel_name = decodeURIComponent(params.channel);
    const channel = data.connection.get_channel(channel_name);
    if (!channel) throw redirect(302, "./home");

    return { ...data, channel };
};