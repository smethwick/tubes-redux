import { assert, expect, expectTypeOf, test } from 'vitest'
import type { IrcMessageEvent } from '../provider+connection';
import { handle_raw_irc_msg, transform_raw_tags } from './common';

test("transform_raw_tags()", () => {
    const input = "@id=123AB;rose";
    const expected = [
        {key: "id", value: "123AB"},
        {key: "rose", value: undefined}
    ];

    const output = transform_raw_tags(input);

    expect(output).toStrictEqual(expected);
})

test("transform_raw_tags() escaped", () => {
    const input = "@id=123\\:A\\sB;ro\\r\\ns\\\\e";
    const expected = [
        {key: "id", value: "123;A B"},
        {key: "ro\r\ns\\e", value: undefined}
    ];

    const output = transform_raw_tags(input);

    expect(output).toStrictEqual(expected);
})

test("try and parse a message", () => {
    const input = `@id=234AB :dan!d@localhost PRIVMSG #chan :Hey what's up!`
    const expected = {
        tags: [
            {"key": "id", "value": "234AB"}
        ],
        source: "dan!d@localhost",
        command: "PRIVMSG",
        params: [
            "#chan",
            "Hey what's up!"
        ],
        timestamp: expect.any(Date),
    }
    const output = handle_raw_irc_msg(input, () => {null});
    
    expectTypeOf(output).toMatchTypeOf<IrcMessageEvent>();
    expect(output).toEqual(expected);
})