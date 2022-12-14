<script lang="ts">
	import { default_config, Providers, type ConnectionInfo } from "$lib/Chat/provider+connection";
	import { onMount } from "svelte";

    
    let test_provider = new Providers[0].provider();
    onMount(() => {
    
        let ci: ConnectionInfo = {
            ...default_config,
            url: new URL("wss://testnet.ergo.chat/webirc"),
        }
    
        test_provider.add_connection(ci);
    
        // test_provider.connect_all();
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={() => test_provider.connect_all()}>connect to the thing</button>