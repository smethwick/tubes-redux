<script>
	import { Providers } from "$lib/Chat/provider+connection";


    let test_provider = new Providers[0].provider();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={() => test_provider.connect_all()}>connect all</button>