export class Link {
    constructor(public content: string) {}
}

export const isALink = (test: string | Link): test is Link => {
    // eslint-disable-next-line no-prototype-builtins
    if (test.hasOwnProperty('content')) return true;
    else return false;
}