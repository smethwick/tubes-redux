export class Nick {
    color: string;

    // taken from https://stackoverflow.com/a/16348977
    // thank you
    decide_colour = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            const string = ('00' + value.toString(16));
            colour += string.substring(string.length - 2);
        }
        return colour;
    }

    constructor(public name: string) {
        this.color = this.decide_colour(name);
    }
}