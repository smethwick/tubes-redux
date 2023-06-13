import { expect, expectTypeOf, test } from 'vitest'
import type { RawIrcMessage } from '../provider+connection';
import { handle_raw_irc_msg, transform_raw_tags, transform_user_line } from './common';

test("transform_raw_tags()", () => {
    const input = "@id=123AB;rose";
    const expected = [
        { key: "id", value: "123AB" },
        { key: "rose", value: undefined }
    ];

    const output = transform_raw_tags(input);

    expect(output).toStrictEqual(expected);
})

test("transform_raw_tags() escaped", () => {
    const input = "@id=123\\:A\\sB;ro\\r\\ns\\\\e";
    const expected = [
        { key: "id", value: "123;A B" },
        { key: "ro\r\ns\\e", value: undefined }
    ];

    const output = transform_raw_tags(input);

    expect(output).toStrictEqual(expected);
})

test("try and parse a message", () => {
    const input = ` @id=234AB :dan!d@localhost PRIVMSG #chan :Hey what's up!`
    const expected = {
        tags: [
            { "key": "id", "value": "234AB" }
        ],
        source: ["dan", "d", "localhost"],
        command: "PRIVMSG",
        params: [
            "#chan",
            "Hey what's up!"
        ],
        timestamp: expect.any(Date),
    }
    const output = handle_raw_irc_msg(input, () => { null });

    expectTypeOf(output).toMatchTypeOf<RawIrcMessage>();
    expect(output).toEqual(expected);
})

test("parse join", () => {
    const input = `:leah!~u@aaaa.oragono JOIN #tubes`
    const expected = {
        tags: undefined,
        source: ["leah", "~u", "aaaa.oragono"],
        command: "JOIN",
        params: [
            "#tubes",
        ],
        timestamp: expect.any(Date),
    }
    const output = handle_raw_irc_msg(input, () => { null });

    expectTypeOf(output).toMatchTypeOf<RawIrcMessage>();
    expect(output).toEqual(expected);
})

test("parse userline", () => {
    const input_only_source = "testnet.leahc.gay";
    const input_full = "thatcher!~u@qvb4ppdq8b9tk.oragono";

    const expected_1 = ["testnet.leahc.gay"];
    const expected_2 = ["thatcher", "~u", "qvb4ppdq8b9tk.oragono"];

    const output_1 = transform_user_line(input_only_source);
    const output_2 = transform_user_line(input_full);

    expect(output_1).toEqual(expected_1);
    expect(output_2).toEqual(expected_2);
})