import type { IrcMessageEvent } from "./provider+connection";
import { v4 as uuidv4 } from 'uuid';

export type task = {
    id: string,
    reply: string,
    complete: boolean,
    callback: (data: IrcMessageEvent) => void
};
export type subscription = {
    id: string,
    until?: string,
    only?: string | string[],
    errors?: string[],
    complete: boolean,
    error_callback?: (data: IrcMessageEvent) => void,
    unsub_callback?: (collected?: IrcMessageEvent[]) => void,
    _collected?: IrcMessageEvent[],
    callback: (data: IrcMessageEvent) => void
}


export class TaskQueue {
    tasks: task[] = [];
    subscriptions: subscription[] = [];

    new_task(reply: string, callback: (data: IrcMessageEvent) => void): string {
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
        callback: (data: IrcMessageEvent) => void,
        options?: {
            until?: string;
            only?: string | string[];
            handle_errors?: {
                errors: string[];
                callback: (data: IrcMessageEvent) => void;
            };
            unsub_callback: (collected?: IrcMessageEvent[]) => void;
        }
    ) {
        const id = uuidv4();
        const subscription: subscription = {
            id,
            until: options?.until,
            only: options?.only,
            complete: false,
            errors: options?.handle_errors?.errors,

            callback,
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
            if (o.reply == event.command) { o.callback(event); return false; }
            else
                return true;
        });

        this.subscriptions.forEach((o) => {
            if (o.until == event.command) {
                this.unsubscribe(o.id);
                if (o.unsub_callback)
                    o.unsub_callback(o._collected);
            }

            if (o.only) {
                if (typeof o.only === typeof []) {
                    if (!(o.only.includes(event.command)))
                        return;
                }
                if (typeof o.only === "string") {
                    if (o.only != event.command)
                        return;
                }
            }

            if (o.unsub_callback) {
                o._collected = o._collected ? [...o._collected, event] : [event];
            }

            o.callback(event);
        });
    }

    wait_for(reply: string, callback: (data: IrcMessageEvent) => void) {
        this.new_task(reply, callback);
    }
}
