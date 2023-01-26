export function extract_bits_from_url(url: string): [hostname: string, port: number] {
    function no() {
        throw new Error('invalid url')
    }

    // let state = url;

    // const protocol = state.substring(0, state.search('://'));
    // if (!protocol) no();

    // state = state.replace(`${protocol}://`, "");
    // console.log(protocol, state);
    
    // const hostname = state.substring(0, state.search(":") ?? state.search("/") ?? state.length);
    
    // console.log(hostname);



    // const final = new URL({

    // });

    throw new Error('not implemented');
}