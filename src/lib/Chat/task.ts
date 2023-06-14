import AsyncLock from "async-lock";
import type { IrcCommand } from "./Providers/common";
import type { RawIrcMessage } from "./provider+connection";
import { v4 as uuidv4 } from 'uuid';

/**
 * An item that can be matched against an IRC message
 */
interface Matchable {
    matches: (msg: RawIrcMessage) => boolean;
}

interface Resolvable {
    id: string;
    /** 
     * Resolve the item (i.e. do thing then delete self if applicable).
     * @returns {boolean} True if the item is resolved
     */
    resolve: (msg: RawIrcMessage) => Promise<boolean>;
}

export enum Wildcard {
    /** Accepts any value */
    Any = "*",
    /** Rejects all values */
    None = "-"
}

export class TaskQueue {
    tasks: Resolvable[] = [];
    lock = new AsyncLock();

    /**  Notify all tasks in the queue and remove resolved ones */
    async resolve_tasks(event: RawIrcMessage) {
        await this.lock.acquire("lock", () => {
            this.tasks = this.tasks.filter(async e => await e.resolve(event));
        })
    }

    /**
     * Expect a message to be received
     * 
     * @param args Mirrors {@link MessageMatcher}
     * @param options.reject_on Reject when any of these {@link Matchable}s are found
     * @param options.cutoff The amount of time to wait in ms before giving up hope
     * @returns A promise that will either resolve to 
     *          the message that matches or reject after the set cutoff time
     *          or a rejectable message is found instead
     */
    async expect_message(
        description: string,
        args: ConstructorParameters<typeof MessageMatcher>,
        options?: {
            reject_on?: ConstructorParameters<typeof MessageMatcher>[],
            cutoff?: number
        }
    ) {
        const mask = new MessageMatcher(...args);
        const expected = new ExpectedMessage(
            description,
            mask,
            options?.reject_on?.map(o => new MessageMatcher(...o)),
            options?.cutoff
        );

        this.tasks.push(expected)

        return expected.promise()
    }

    /**
     * 
     * @param description A short description of the collection
     * @param options.start The trigger message to start collection
     * @param options.include Messages to include in the collection
     * @param options.finish The trigger message to finish collection and return the result
     * @param options.reject_on Throws an error if matched
     * @param options.include_start_and_finish Whether or not to include the start and finish messages in the collection
     * @returns A list of the collected messages
     */
    async collect(
        description: string,
        options: {
            start: Matchable | "immediately",
            include: Matchable,
            finish: Matchable,
            reject_on?: Matchable,
            include_start_and_finish?: boolean
        }
    ): Promise<RawIrcMessage[]> {
        const collection = new Collection(
            description,
            options.start,
            options.include,
            options.finish,
            {
                reject_on: options.reject_on,
                include_start_and_finish: options?.include_start_and_finish ?? false
            }
        );
        await this.lock.acquire("lock", () => {
            this.tasks.push(collection);
        });

        return collection.task.promise;
    }

    /**
     * 
     * @param description A descriptive name for this subscription
     * @param filters A list of {@link Matchables} to match against
     * @param callback Runs every time a message is recieved that matches
     *                 the provided filters. Use unsubscribe() 
     *                 to remove the subscription from the task queue
     * @returns nothing
     */
    async subscribe(
        description: string,
        filters: Matchable,
        callback: (message: RawIrcMessage, unsubscribe: () => void) => void,
    ) {
        const subscription = new Subscription(
            description,
            filters,
            callback,
            this
        );

        await this.lock.acquire("lock", () => {
            this.tasks.push(subscription);
        });

        return subscription
    }

    /**
     * Collect a list of messages using the IRCv3 
     * {@link https://ircv3.net/specs/extensions/batch batch extension}
     * @param description A descriptive label for this task
     * @param type The type of the batch
     */
    async collect_batch(
        description: string,
        type: string,
    ) {
        const batch_collector = new BatchCollection(description, type);
        await this.lock.acquire("lock", () => {
            this.tasks.push(batch_collector);
        });

        return batch_collector.task.promise;
    }

    /**
     * Remove a task from the queue
     * @param id the uuid of the task
     */
    async remove_task(id: string) {
        // NOTE: if there ever happens to be a memory leak here,
        // it's likely because this function finished before
        // resolve_tasks() could finish reassigning this.tasks.
        // I have no idea if this will ever happen in practice
        await this.lock.acquire("lock", () => {
            this.tasks = this.tasks.filter(o => o.id != id);
        });
    }
}

class ExpectedMessage implements Resolvable {
    public id: string;
    private deferred = new Deferred<RawIrcMessage>();
    private done = false;

    /**
     * 
     * @param expected The {@link Matchable} to compare against incoming messages
     * @param cutoff The amount of time in ms to wait for the message 
     */
    constructor(
        public description: string,
        public expected: Matchable,
        public reject_on?: Matchable[],
        cutoff: number = 5000,
    ) {
        this.id = uuidv4();

        setTimeout(() => {
            if (!this.done) this.deferred.reject!(`${this.description}: Timed Out`)
        }, cutoff);
    }

    resolve = async (msg: RawIrcMessage) => {
        if (this.reject_on?.find(o => o.matches(msg))) {
            this.done = true;
            this.deferred.reject!(JSON.stringify(msg));
        }

        if (this.expected.matches(msg)) {
            this.done = true;
            console.info(`expected message "${this.description}" recieved`)
            this.deferred.resolve!(msg);
            return true;
        }

        return false;
    };

    promise = () => this.deferred.promise
}

export class BatchCollection implements Resolvable {
    id: string;
    task = new Deferred<RawIrcMessage[]>();
    collection: RawIrcMessage[] = [];
    name?: string;

    private collecting = false;

    constructor(public description: string, public type: string) {
        this.id = uuidv4();
    }

    async resolve(event: RawIrcMessage): Promise<boolean> {
        const start_matcher = new MessageMatcher("BATCH", [Wildcard.Any, ...this.type.split(" ")]);
        if (start_matcher.matches(event)) {
            this.collecting = true;
            this.name = event.params[0].replace("+", "");
            return true;
        }

        if (!this.collecting || !this.name) return true;

        if (!this.task.resolve || !this.task.reject) throw new Error("task not yet initialised");

        if (event.tags && event.tags.find(t => t.key == "batch" && t.value == this.name))
            this.collection.push(event);

        const end_matcher = new MessageMatcher("BATCH", [`-${this.name}`]);
        if (end_matcher.matches(event)) {
            this.task.resolve(this.collection);
            return false;
        }

        return true;
    }
}


/**
 * Describes an IRC message that can be used to check 
 * against incoming irc messages 
 */
export class MessageMatcher implements Matchable {
    constructor(
        public command: string | Wildcard,
        public params?: (string | Wildcard)[],
        public extras?: {
            tags?: { key: string, value: string }[]
        }
    ) { }

    matches(msg: RawIrcMessage): boolean {
        return this._match_command(msg.command)
            && this._match_params(msg.params)
            && this._match_tags(msg.tags);
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

    _match_tags(input_tags: { key: string, value?: string }[] | undefined) {
        if (!this.extras?.tags) return true;

        return JSON.stringify(input_tags) == JSON.stringify(this.extras.tags);
    }
}

export class MessageMatcherGroup implements Matchable {
    constructor(public masks: MessageMatcher[]) { }

    matches(msg: RawIrcMessage): boolean {
        // Look for any masks that match
        return Boolean(this.masks.find(o => o.matches(msg)));
    }
}


export const match = (...args: ConstructorParameters<typeof MessageMatcher>) =>
    new MessageMatcher(...args);

export const group = (matchers: ConstructorParameters<typeof MessageMatcher>[]) =>
    new MessageMatcherGroup(matchers.map(o => new MessageMatcher(...o)));

class Collection implements Resolvable {
    id: string;
    task = new Deferred<RawIrcMessage[]>();
    collection: RawIrcMessage[] = [];

    private collecting = false;
    private include_start_and_finish;
    private reject_on?: Matchable;

    constructor(
        private description: string,
        private start: Matchable | "immediately",
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

    async resolve(data: RawIrcMessage): Promise<boolean> {
        if (this.task.reject
            && this.reject_on
            && this.reject_on.matches(data)) this.task.reject(JSON.stringify(data));

        if (this.start == "immediately" && this.collecting == false) {
            this.collecting = true;
        }

        if (this.start != "immediately" && this.start.matches(data)) {
            if (this.include_start_and_finish) this.collection.push(data);
            this.collecting = true;
            return true;
        }
        if (!this.task.resolve || !this.task.reject) throw new Error("task not yet initialised");

        if (!this.collecting) return true;

        if (this.finish.matches(data)) {
            if (this.include_start_and_finish) this.collection.push(data);
            this.collecting = false;
            console.info(`${this.description}: finished collecting`, data);
            this.task.resolve(this.collection);
            return false;
        }

        if (this.include.matches(data)) {
            this.collection.push(data);
            return true;
        };

        return true;
    }
}

export class Deferred<T> {
    promise: Promise<T>;
    reject: ((reason?: string) => void) | undefined;
    resolve: ((value: T | PromiseLike<T>) => void) | undefined;

    rejected = false;
    resolved = false;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = (reason?: string) => {
                this.rejected = true;
                reject(reason)
            }
            this.resolve = (value: T | PromiseLike<T>) => {
                this.resolved = true;
                resolve(value)
            }
        })
    }
}

export class Subscription implements Resolvable {
    id = uuidv4();

    constructor(
        public description: string,
        public filters: Matchable,
        public callback: (message: RawIrcMessage, unsubscribe: () => void) => void,
        private task_queue: TaskQueue,
    ) { }

    unsubscribe() {
        this.task_queue.remove_task(this.id);
    }

    resolve = async (msg: RawIrcMessage) => {
        if (this.filters.matches(msg)) {
            this.callback(msg, () => this.unsubscribe());
        }

        return true;
    };
}