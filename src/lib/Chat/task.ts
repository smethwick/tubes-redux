import type { IrcMessageEvent } from "./provider+connection";
import { v4 as uuidv4 } from 'uuid';

export type task = {
    id: string,
    reply: string | msg_description,
    complete: boolean,
    callback: (data: IrcMessageEvent) => void
};
export type subscription = {
    id: string,
    until?: msg_description | (() => boolean),
    only?: msg_description | msg_description[],
    errors?: string[],
    complete: boolean,
    error_callback?: (data: IrcMessageEvent) => void,
    unsub_callback?: (collected?: IrcMessageEvent[]) => void,
    _collected?: IrcMessageEvent[],
    callback: ((data: IrcMessageEvent) => void) | null
}
export type msg_description = {
    command: string,
    params?: string[],
}


export class TaskQueue {
    tasks: task[] = [];
    subscriptions: subscription[] = [];

    new_task(reply: string | msg_description, callback: (data: IrcMessageEvent) => void): string {
        const id = uuidv4();
        const task: task = {
            id,
            reply,
            complete: false,
            callback
        };
        this.tasks.push(task);
        return id;
    }

    subscribe(
        callback: ((data: IrcMessageEvent) => void) | null,
        options?: {
            until?: msg_description | (() => boolean);
            only?: msg_description | msg_description[];
            handle_errors?: {
                errors: string[];
                callback: (data: IrcMessageEvent) => void;
            };
            unsub_callback?: (collected?: IrcMessageEvent[]) => void;
        }
    ) {
        const id = uuidv4();
        const subscription: subscription = {
            id,
            until: options?.until,
            only: options?.only,
            complete: false,
            errors: options?.handle_errors?.errors,

            callback: callback,
            error_callback: options?.handle_errors?.callback,
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
        this.tasks = this.tasks.filter((o) => {
            if (typeof o.reply == "string") {
                if (o.reply == event.command) { o.callback(event); return false; }
                return true;
            }

            if (do_we_care_about_it(o.reply, event)) { o.callback(event); return false; }
            else
                return true;
        });

        const unsub = (o: subscription) => {
            this.unsubscribe(o.id);
            if (o.unsub_callback)
                o.unsub_callback(o._collected);

        }

        this.subscriptions.forEach((o) => {
            if (o.until && typeof o.until == "function") o.until() ? unsub(o) : null;
            else if (o.until && do_we_care_about_it(o.until, event)) unsub(o);

            if (o.only && !do_we_care_about_it(o.only, event)) return;

            if (o.unsub_callback) {
                o._collected = o._collected ? [...o._collected, event] : [event];
            }

            if (o.callback) o.callback(event);
        });

    }

    on(reply: string | msg_description, callback: (data: IrcMessageEvent) => void) {
        this.new_task(reply, callback);
    }
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
            if (!result) result = process_single(only, msg);
        }
        return result;
    }

    function process_single(only: msg_description, msg: IrcMessageEvent): boolean {
        if (only.command != msg.command) return false;
        if (only.params) {
            for (const [i, param] of only.params.entries()) {
                if (msg.params[i] != param) return false
            }
        }

        return true;
    }
}


// function are_we_done(sub: subscription, msg: IrcMessageEvent): boolean {

// }
