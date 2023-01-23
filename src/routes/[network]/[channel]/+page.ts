import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
    const { channel } = params;
    return { channel };
};