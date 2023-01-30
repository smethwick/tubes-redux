import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({url, parent}) => {
    await parent();
    throw redirect(302, (url.pathname + "/home"));
};