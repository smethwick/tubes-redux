import { writable, type Writable } from "svelte/store";

export class Setting<T> {
    property: Writable<T>;
    key: string;

    constructor(key: string, inital_value: T) {
        this.key = "config:" + key;
        
        const from_storage = localStorage.getItem(this.key);
        if (from_storage) {
            const value: T = JSON.parse(from_storage);
            this.property = writable(value);
        } else {
            this.property = writable(inital_value);
        }
        ({ subscribe: this.subscribe, set: this.store_set, update: this.update } = this.property);
    }

    subscribe;
    store_set;
    update;

    set = (val: T) => {
        localStorage.setItem(this.key, JSON.stringify(val));
        this.store_set(val);
    };

    get = (): T => {
        const ls = localStorage.getItem(this.key);
        if (!ls) throw new Error("key is not defined");

        return JSON.parse(ls)
    }
}

export const message_layout = new Setting<"comfy" | "compact">("layout", "compact");