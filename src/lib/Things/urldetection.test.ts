import { expect, test } from 'vitest'
import { is_it_a_url } from './urldetection';

test("check url tester", () => {
    const input: [string, boolean][] = [
        ["https://google.com", true],
        ["http://google.com", true],
        ["http://google.com/something", true],
        ["http://google.com/something.png", true],
        ["http://google.com/index.html#anchor", true],

        ["fihdiffuwedflamf", false],
        ["www.aaaaaaaaaaaaaa", false],
        ["www.-.ln", false],
        ["www.-flmfef.kgfoiwgfoj", false],
        ["foufos.aa", false],
        ["http://aaaaa", false],
        ["www.piss#.org", false],
    ];

    input.forEach((o) => {
        const output = is_it_a_url(o[0]);
        expect(output).toEqual(o[1]);
    })
})