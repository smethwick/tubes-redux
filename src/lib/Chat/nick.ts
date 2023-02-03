export class Nick {
    color: [string, string];

    // taken from https://stackoverflow.com/a/7493982
    // thank you
    decide_colour = (seed: string) => {
        const arr: [string, string][] = [
            ["text-red-600", "hover:bg-red-50",],
            ["text-orange-600", "hover:bg-orange-50",],
            ["text-amber-600", "hover:bg-amber-50",],
            ["text-yellow-600", "hover:bg-yellow-50",],
            ["text-lime-600", "hover:bg-lime-50",],
            ["text-green-600", "hover:bg-green-50",],
            ["text-emerald-600", "hover:bg-emerald-50",],
            ["text-teal-600", "hover:bg-teal-50",],
            ["text-cyan-600", "hover:bg-cyan-50",],
            ["text-sky-600", "hover:bg-sky-50",],
            ["text-blue-600", "hover:bg-blue-50",],
            ["text-indigo-600", "hover:bg-indigo-50",],
            ["text-violet-600", "hover:bg-violet-50",],
            ["text-purple-600", "hover:bg-purple-50",],
            ["text-fuchsia-600", "hover:bg-fuchsia-50",],
            ["text-pink-600", "hover:bg-pink-50",],
            ["text-rose-600", "hover:bg-rose-50",],
        ];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore i'm so tired. i know this works.
        const charCodes: number = seed.split('').reduce(function (a, b, i): number {
            return (i == 1 ? a.charCodeAt(0) : +a) + b.charCodeAt(0);
        });
        return arr[charCodes % arr.length]
    }

    constructor(public name: string) {
        this.color = this.decide_colour(name);
    }
}