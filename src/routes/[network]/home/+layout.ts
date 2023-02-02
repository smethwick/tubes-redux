import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({parent, params}) => {
    const data = await parent();

    if (data.connection == undefined) throw error(404);

    return data;
};