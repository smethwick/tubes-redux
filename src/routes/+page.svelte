<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';

	import { default_config, Providers, type ConnectionInfo } from '$lib/Chat/provider+connection';
	import { db, type Message } from '$lib/Storage/db';
	import { browser } from '$app/environment';

	let test_provider = new Providers[0].provider();

    let msgs: Message[];
    let msgs_store = liveQuery(() => browser ? db.messages.toArray() : []);
    $: msgs = $msgs_store as Message[]

	onMount(() => {
		let ci: ConnectionInfo = {
			...default_config,
            name: "tilde.chat",
			url: new URL('wss://testnet.ergo.chat/webirc')
		};

		let conn = test_provider.add_connection(ci);
		conn.on_msg = async (e) => {
			const id = await db.messages.add({ origin: e });
		};

		// test_provider.connect_all();
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={() => test_provider.connect_all()}>connect to the thing</button>

{#if msgs}
    {#each msgs as msg (msg.id)}
        <p>{msg.origin.params[msg.origin.params.length - 1]}</p>
    {/each}
{/if}
