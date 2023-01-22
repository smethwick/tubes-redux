<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';

	import {
		default_config,
		default_icons,
		type ConnectionInfo
	} from '$lib/Chat/provider+connection';
	import { db } from '$lib/Storage/db';
	import { saveMessage, type Message } from "$lib/Storage/messages";
	import { browser } from '$app/environment';
	import { provider } from '$lib/Chat';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import { showMessage } from '$lib/Display/Chat';

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
		conn.on_msg = saveMessage;
	};
</script>

<button on:click={() => $provider.connections[0].connect()}>connect to the thing</button>
<button on:click={() => addProvider()}>new thing</button>
<button on:click={() => $provider.connections[0].join_channel("#tubes")}>join #tubes</button>

{#each $provider.connections as conn}
	{conn.connection_info.name}
{/each}

{#if msgs}
<button on:click={() => db.messages.bulkDelete(msgs.map((v) => v.id ?? 0))}>clear all</button>

	{#each msgs as msg (msg.id)}
		<MessageView {msg} />
	{/each}
{/if}
