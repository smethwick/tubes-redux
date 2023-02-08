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
    params?: string[],
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

export class TaskQueue {
    tasks: (task | async_task<IrcMessageEvent>)[] = [];
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
        // don't worry about this. it's fine. probably
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isAsync = (obj: any): obj is async_task<IrcMessageEvent> => {
            if (obj.task) return true;
            else return false;
        }


        this.tasks = this.tasks.filter((o) => {
            if (isAsync(o)) {
                if (!o.task.resolve || !o.task.reject) throw new Error("task not yet initialised");

                if (o.reject_on && o.reject_on.find(o => do_we_care_about_it(o, event))) {
                    o.task.reject(JSON.stringify(event));
                    return false;
                }

                if (typeof o.reply == "string" && o.reply == event.command) { resolve_async_task(o, event); return false; };
                if (typeof o.reply != "string" && do_we_care_about_it(o.reply, event)) { resolve_async_task(o, event); return false; };
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

            if (o.until && typeof o.until == "function") o.until() ? unsub(o) : null;
            else if (o.until && do_we_care_about_it(o.until, event)) unsub(o);

            if (o.only && !do_we_care_about_it(o.only, event)) return;

            if (o.unsub_callback) {
                o._collected = o._collected ? [...o._collected, event] : [event];
            }

            if (o.callback) o.callback(event);
        });

    }

    async wait_for(reply: string | msg_description | msg_description[], opt?: { reject_on?: msg_description[] }): Promise<IrcMessageEvent> {
        return this.new_async_task(reply, opt?.reject_on);
    }
}

function resolve_async_task(task: async_task<IrcMessageEvent>, msg: IrcMessageEvent): boolean {
    if (!task.task.resolve || !task.task.reject) throw new Error("task not yet initialised");

    task.task.resolve(msg);
    return true;
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
        if (only.params) {
            const aaa = only.params.filter((o, i) => {
                if (o == "*") return true;
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


// function are_we_done(sub: subscription, msg: IrcMessageEvent): boolean {

// }
