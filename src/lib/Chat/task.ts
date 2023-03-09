/**
 * this is not a place of honor
 * no highly esteemed deed is commemorated here
 */

import type { IrcMessageEvent } from "./provider+connection";
import { v4 as uuidv4 } from 'uuid';

export type task = {
    id: string,
    reply: string | msg_description,
    complete: boolean,
    callback: (data: IrcMessageEvent) => void
}

/**
 * similar to a {@link task}, but with promises, y'know?
 */
export type async_task<T> = {
    id: string,
    reply: string | msg_description | msg_description[],
    task: Deferred<T>,
    reject_on?: msg_description[],
}

class BatchCollector {
    collection_collection: BatchCollection[] = [];

    add(c: BatchCollection) {
        this.collection_collection.push(c);
    }

    async handle(data: IrcMessageEvent) {
        this.collection_collection = this.collection_collection.filter(o => o.resolve(data))
    }
}

class BatchCollection {
    id: string;
    task = new Deferred<IrcMessageEvent[]>();
    collection: IrcMessageEvent[] = [];
    name?: string;

    private collecting = false;

    constructor(public type: string) {
        this.id = uuidv4();
    }

    resolve(event: IrcMessageEvent): boolean {
        if (do_we_care_about_it({ command: "BATCH", params: [Wildcard.Any, ...this.type.split(" ")] }, event)) {
            this.collecting = true;
            this.name = event.params[0].replace("+", "");
            return true;
        }

        if (!this.collecting || !this.name) return true;

        if (!this.task.resolve || !this.task.reject) throw new Error("task not yet initialised");

        if (event.tags && event.tags.find(t => t.key == "batch" && t.value == this.name))
            this.collection.push(event);

        if (event.command == "BATCH" && event.params[0] == `-${this.name}`) {
            this.task.resolve(this.collection);
            return false;
        }

        return true;
    }
}

class MessageDescription {

}

class Collector {
    collection_collection: Collection[] = [];

    async handle(data: IrcMessageEvent) {
        this.collection_collection = this.collection_collection.filter(o => o.resolve(data))
    }

    add(c: Collection) {
        this.collection_collection.push(c);
    }
}

class Collection {
    id: string;
    task = new Deferred<IrcMessageEvent[]>();
    collection: IrcMessageEvent[] = [];

    private collecting = false;
    private include_start_and_finish;
    private reject_on?: msg_description[];

    constructor(
        private start: msg_description,
        private include: msg_description[],
        private finish: msg_description | msg_description[],
        { reject_on, include_start_and_finish }: {
            reject_on?: msg_description[], include_start_and_finish?: boolean
        },
    ) {
        this.id = uuidv4();
        this.reject_on = reject_on;
        this.include_start_and_finish = include_start_and_finish ?? false;
    }

    resolve(data: IrcMessageEvent): boolean {
        if (do_we_care_about_it(this.start, data)) {
            console.log("here");
            if (this.include_start_and_finish) this.collection.push(data);
            this.collecting = true;
            return true;
        }

        if (!this.collecting) return true;

        if (!this.task.resolve || !this.task.reject) throw new Error("task not yet initialised");
        if (this.reject_on && this.reject_on.find(o => do_we_care_about_it(o, data))) this.task.reject();

        if (do_we_care_about_it(this.finish, data)) {
            if (this.include_start_and_finish) this.collection.push(data);
            this.collecting = false;
            console.log(`${this.id} finished collecting`, data);
            this.task.resolve(this.collection);
            return false;
        }

        if (this.include.find(o => do_we_care_about_it(o, data))) {
            this.collection.push(data);
            return true;
        };

        return true;
    }
}

export type subscription = {
    id: string,
    until?: msg_description | msg_description[] | (() => boolean),
    only?: msg_description | msg_description[],
    errors?: string[] | msg_description[],
    complete: boolean,
    unsub_callback?: (collected?: IrcMessageEvent[]) => void,
    _collected?: IrcMessageEvent[],
    callback: ((data: IrcMessageEvent) => void) | null
}

export type msg_description = {
    command: string,
    params?: string[] | number,
}

export class Deferred<T> {
    promise: Promise<T>;
    reject: ((reason?: string) => void) | undefined;
    resolve: ((value: T | PromiseLike<T>) => void) | undefined;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        })
    }
}

// don't worry about this. it's fine. probably
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAsync = (obj: any): obj is async_task<IrcMessageEvent> => {
    if (obj.reply && obj.task) return true;
    else return false;
}

export class TaskQueue {
    tasks: (task | async_task<IrcMessageEvent>)[] = [];
    collector: Collector = new Collector();
    batch_collector = new BatchCollector();
    subscriptions: subscription[] = [];

    new_async_task(reply: string | msg_description | msg_description[], reject_on?: msg_description[]) {
        const id = uuidv4();
        const d = new Deferred<IrcMessageEvent>();

        const task: async_task<IrcMessageEvent> = {
            id,
            reply,
            task: d,
            reject_on: reject_on
        }
        this.tasks.push(task);

        return d.promise;
    }

    /**
     * @deprecated
     */
    subscribe(
        callback: ((data: IrcMessageEvent) => void) | null,
        options?: {
            until?: msg_description | msg_description[] | (() => boolean);
            only?: msg_description | msg_description[];
            handle_errors?: string[] | msg_description[];
            unsub_callback?: (collected?: IrcMessageEvent[]) => void;
        }
    ) {
        const id = uuidv4();
        const subscription: subscription = {
            id,
            until: options?.until,
            only: options?.only,
            complete: false,
            errors: options?.handle_errors,

            callback: callback,
            unsub_callback: options?.unsub_callback,
        };
        this.subscriptions.push(subscription);
        return id;
    }

    unsubscribe(id: string) {
        this.subscriptions = this.subscriptions.filter((o) => o.id != id);
        console.log("unsubscrumbled ", id);
    }

    async resolve_tasks(event: IrcMessageEvent) {
        this.collector.handle(event);
        this.batch_collector.handle(event);

        this.tasks = this.tasks.filter((o) => {
            if (isAsync(o)) {
                handle_async(o, event);
            } else {
                if (typeof o.reply == "string" && o.reply == event.command) { o.callback(event); return false; };
                if (typeof o.reply != "string" && do_we_care_about_it(o.reply, event)) { o.callback(event); return false; };
            }

            return true;
        });

        const unsub = (o: subscription) => {
            this.unsubscribe(o.id);
            if (o.unsub_callback)
                o.unsub_callback(o._collected);

        }

        this.subscriptions.forEach((o) => {
            if (o.errors) o.errors.forEach(o => {
                if (typeof o == "string" && o == event.command) throw o;
                else if (typeof o != "string" && do_we_care_about_it(o, event)) throw o;
            })

            if (o.only && !do_we_care_about_it(o.only, event)) return;
            if (o.callback) o.callback(event);

            if (o.until && typeof o.until == "function") o.until() ? unsub(o) : null;
            else if (o.until && do_we_care_about_it(o.until, event)) unsub(o);


            if (o.unsub_callback) {
                o._collected = o._collected ? [...o._collected, event] : [event];
            }
        });

    }

    async wait_for(reply: string | msg_description | msg_description[], opt?: { reject_on?: msg_description[] }): Promise<IrcMessageEvent> {
        return this.new_async_task(reply, opt?.reject_on);
    }

    async collect_batch(type: string): Promise<IrcMessageEvent[]> {
        const c = new BatchCollection(type);
        this.batch_collector.add(c);

        return c.task.promise;
    }

    async collect(
        start: msg_description,
        include: msg_description[],
        finish: msg_description,
        options?: {
            reject_on?: msg_description[], 
            include_start_and_finish?: boolean
        }
    ): Promise<IrcMessageEvent[]> {
        const collection = new Collection(start, include, finish, {
            reject_on: options?.reject_on,
            include_start_and_finish: options?.include_start_and_finish ?? false
        });
        this.collector.add(collection);

        return collection.task.promise;
    }
}

function resolve_async_task(task: async_task<IrcMessageEvent>, msg: IrcMessageEvent): boolean {
    if (!task.task.resolve || !task.task.reject) throw new Error("task not yet initialised");

    task.task.resolve(msg);
    return true;
}

export enum Wildcard {
    Any = "*",
    None = "-"
}

function do_we_care_about_it(what_were_looking_for: msg_description | msg_description[], msg: IrcMessageEvent): boolean {
    const isArray = (obj: unknown): obj is Array<unknown> => {
        if (Object.prototype.toString.call(obj) === '[object Array]') return true;
        else return false;
    }
    if (!what_were_looking_for) return true;

    let result = false;
    if (isArray(what_were_looking_for)) result = process_array(what_were_looking_for, msg);
    else result = process_single(what_were_looking_for, msg);

    return result;

    function process_array(list: msg_description[], msg: IrcMessageEvent): boolean {
        let result = false;
        for (const only of list) {
            if (result) break;
            result = process_single(only, msg);
        }
        return result;
    }

    function process_single(only: msg_description, msg: IrcMessageEvent): boolean {
        if (only.command != msg.command) return false;
        if (typeof only.params == "number" && msg.params.length != only.params) return false;
        if (only.params && typeof only.params != "number") {

            const aaa = only.params.filter((o, i) => {
                if (o == "*") return true;
                if (o == "-") return false;
                if (msg.params.at(i) == o) return true;
                return false;
            });

            let res = true;
            only.params.forEach((o, i) => {
                if (aaa[i] != o && aaa[i] != "*") res = false;
            })

            if (!res) return false;
        }

        return true;
    }
}

function handle_async(task: async_task<IrcMessageEvent>, msg: IrcMessageEvent) {
    if (!task.task.resolve || !task.task.reject) throw new Error("task not yet initialised");

    if (task.reject_on && task.reject_on.find(o => do_we_care_about_it(o, msg))) {
        task.task.reject(JSON.stringify(msg));
        return false;
    }

    if (typeof task.reply == "string" && task.reply == msg.command) { resolve_async_task(task, msg); return false; };
    if (typeof task.reply != "string" && do_we_care_about_it(task.reply, msg)) { resolve_async_task(task, msg); return false; };
}