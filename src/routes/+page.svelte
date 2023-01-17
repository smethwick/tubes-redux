<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';

	import {
		default_config,
		default_icons,
		type ConnectionInfo
	} from '$lib/Chat/provider+connection';
	import { db, type Message } from '$lib/Storage/db';
	import { browser } from '$app/environment';
	import { provider } from '$lib/Chat';

	let msgs: Message[];
	let msgs_store = liveQuery(() => (browser ? db.messages.toArray() : []));
	$: msgs = $msgs_store as Message[];

	const addProvider = async () => {
		let ci: ConnectionInfo = {
			...default_config,
			name: 'aaaaaaaaaa',
			icon: default_icons[Math.floor(Math.random() * default_icons.length)],
			url: 'wss://testnet.ergo.chat/webirc'
		};

		let conn = $provider.add_persistent_connection(ci);
		conn.on_msg = async (e) => {
			await db.messages.add({ origin: e });
		};
	};
</script>

<button on:click={() => $provider.connections[0].connect()}>connect to the thing</button>
<button on:click={() => addProvider()}>new thing</button>

{#each $provider.connections as conn}
	{conn.connection_info.name}
{/each}

{#if msgs}
	{#each msgs as msg (msg.id)}
		<p>{msg.origin.params[msg.origin.params.length - 1]}</p>
	{/each}
{/if}
