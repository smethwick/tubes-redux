/**
 * this is not a place of honor
 * no highly esteemed deed is commemorated here
 */

import type { CommandList } from "./Providers/common";
import type { RawIrcMessage } from "./provider+connection";
import { v4 as uuidv4 } from 'uuid';

export type task = {
    id: string,
    reply: string | msg_description,
    complete: boolean,
    callback: (data: RawIrcMessage) => void
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

    async handle(data: RawIrcMessage) {
        this.collection_collection = this.collection_collection.filter(o => o.resolve(data))
    }
}

class BatchCollection {
    id: string;
    task = new Deferred<RawIrcMessage[]>();
    collection: RawIrcMessage[] = [];
    name?: string;

    private collecting = false;

    constructor(public type: string) {
        this.id = uuidv4();
    }

    resolve(event: RawIrcMessage): boolean {
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

interface Matchable {
    match: (msg: RawIrcMessage) => boolean;
}

/// Describes an IRC message that can be used to check
/// against incoming irc messages
class MessageMask implements Matchable {
    constructor(
        public command: CommandList | Wildcard,
        public params?: (string | Wildcard)[]
    ) {

    }

    match(msg: RawIrcMessage): boolean {
        return this._match_command(msg.command)
            && this._match_params(msg.params);
    }

    _match_command(input_command: string): boolean {
        // if the command is a wildcard, do the corresponding thing
        if (this.command == Wildcard.Any) return true;
        if (this.command == Wildcard.None) return false;

        return this.command == input_command
    }

    _match_params(input_params: string[]): boolean {
        let result = true;

        this.params?.forEach((e, idx) => {
            // if something doesn't match, return immedately
            if (result = false) return result;

            const matcher = input_params?.[idx];

            if (e == Wildcard.Any) result = true;
            if (e == Wildcard.None) result = false;

            if (e == matcher) result = true
        });

        return result;
    }
}

class MessageMaskGroup implements Matchable {
    constructor(public masks: MessageMaskGroup) { }

    match(msg: RawIrcMessage): boolean {
        // Look for any masks that match
        return Boolean(this.masks.find(o => o.match(msg)));
    }
}

class Collector {
    collection_collection: Collection[] = [];

    async handle(data: RawIrcMessage) {
        this.collection_collection = this.collection_collection.filter(o => o.resolve(data))
    }

    add(c: Collection) {
        this.collection_collection.push(c);
    }
}

class Collection {
    id: string;
    task = new Deferred<RawIrcMessage[]>();
    collection: RawIrcMessage[] = [];

    private collecting = false;
    private include_start_and_finish;
    private reject_on?: Matchable;

    constructor(
        private start: Matchable,
        private include: Matchable,
        private finish: Matchable,
        { reject_on, include_start_and_finish }: {
            reject_on?: Matchable, include_start_and_finish?: boolean
        },
    ) {
        this.id = uuidv4();
        this.reject_on = reject_on;
        this.include_start_and_finish = include_start_and_finish ?? false;
    }

    resolve(data: RawIrcMessage): boolean {
        if (this.task.reject
            && this.reject_on
            && this.reject_on.find(o => do_we_care_about_it(o, data))) this.task.reject(JSON.stringify(data));

        if (do_we_care_about_it(this.start, data)) {
            if (this.include_start_and_finish) this.collection.push(data);
            this.collecting = true;
            return true;
        }
        if (!this.task.resolve || !this.task.reject) throw new Error("task not yet initialised");

        if (!this.collecting) return true;

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
    until?: Matchable | (() => boolean),
    only?: Matchable,
    errors?: string[] | Matchable,
    complete: boolean,
    unsub_callback?: (collected?: RawIrcMessage[]) => void,
    _collected?: RawIrcMessage[],
    callback: ((data: RawIrcMessage) => void) | null
}

// export type msg_description = {
//     command: string,
//     params?: string[] | number,
//     tags?: { key: string, value: string };
// }

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
const isAsync = (obj: any): obj is async_task<RawIrcMessage> => {
    if (obj.reply && obj.task) return true;
    else return false;
}

export class TaskQueue {
    tasks: (task | async_task<RawIrcMessage>)[] = [];
    collector: Collector = new Collector();
    batch_collector = new BatchCollector();
    subscriptions: subscription[] = [];

    new_async_task(reply: string | Matchable, reject_on?: Matchable) {
        const id = uuidv4();
        const d = new Deferred<RawIrcMessage>();

        const task: async_task<RawIrcMessage> = {
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
        callback: ((data: RawIrcMessage) => void) | null,
        options?: {
            until?: Matchable | (() => boolean);
            only?: Matchable;
            handle_errors?: string[] | Matchable;
            unsub_callback?: (collected?: RawIrcMessage[]) => void;
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

    async resolve_tasks(event: RawIrcMessage) {
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

    async wait_for(reply: string | msg_description | msg_description[], opt?: { reject_on?: msg_description[] }): Promise<RawIrcMessage> {
        return this.new_async_task(reply, opt?.reject_on);
    }

    async collect_batch(type: string): Promise<RawIrcMessage[]> {
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
    ): Promise<RawIrcMessage[]> {
        const collection = new Collection(start, include, finish, {
            reject_on: options?.reject_on,
            include_start_and_finish: options?.include_start_and_finish ?? false
        });
        this.collector.add(collection);

        return collection.task.promise;
    }
}

function resolve_async_task(task: async_task<RawIrcMessage>, msg: RawIrcMessage): boolean {
    if (!task.task.resolve || !task.task.reject) throw new Error("task not yet initialised");

    task.task.resolve(msg);
    return true;
}

export enum Wildcard {
    Any = "*",
    None = "-"
}

function do_we_care_about_it(what_were_looking_for: msg_description | msg_description[], msg: RawIrcMessage): boolean {
    const isArray = (obj: unknown): obj is Array<unknown> => {
        if (Object.prototype.toString.call(obj) === '[object Array]') return true;
        else return false;
    }
    if (!what_were_looking_for) return true;

    let result = false;
    if (isArray(what_were_looking_for)) result = process_array(what_were_looking_for, msg);
    else result = process_single(what_were_looking_for, msg);

    return result;

    function process_array(list: msg_description[], msg: RawIrcMessage): boolean {
        let result = false;
        for (const only of list) {
            if (result) break;
            result = process_single(only, msg);
        }
        return result;
    }

    function process_single(only: msg_description, msg: RawIrcMessage): boolean {
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
        if (only.tags) {
            if (!msg.tags?.includes(only.tags)) return false;
        }

        return true;
    }
}

function handle_async(task: async_task<RawIrcMessage>, msg: RawIrcMessage) {
    if (!task.task.resolve || !task.task.reject) throw new Error("task not yet initialised");

    if (task.reject_on && task.reject_on.find(o => do_we_care_about_it(o, msg))) {
        task.task.reject(JSON.stringify(msg));
        return false;
    }

    if (typeof task.reply == "string" && task.reply == msg.command) { resolve_async_task(task, msg); return false; };
    if (typeof task.reply != "string" && do_we_care_about_it(task.reply, msg)) { resolve_async_task(task, msg); return false; };
}