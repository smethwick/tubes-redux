import { z } from "zod";

export class Link {
    constructor(public content: string) {}
}

export const link_schema = z.instanceof(Link);

export enum MediaType {
    Image,
    Video,
    Audio,
    
}

export class Media {
    trusted = true;

    constructor(public url: string, public type: MediaType) {}
}

export const media_schema = z.instanceof(Media);