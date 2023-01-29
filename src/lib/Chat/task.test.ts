import { assert, expect, expectTypeOf, test } from 'vitest'
import { TaskQueue } from './task';

test("make a task queue", () => {
    const output = new TaskQueue();

    expect(output);
})

