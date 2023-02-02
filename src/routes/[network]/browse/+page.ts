import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({parent}) => {
    const data = await parent();

    if (!data.connection.check_connection()) throw redirect(302, "./home");

    return data;
};