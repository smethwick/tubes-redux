import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({parent, params}) => {
    const data = params;

    return data;
};