<script lang="ts">
	import { liveQuery } from 'dexie';

	import {
		default_config,
		default_icons,
		type ConnectionInfo
	} from '$lib/Chat/provider+connection';
	import { db } from '$lib/Storage/db';
	import { saveMessage, type Message } from '$lib/Storage/messages';
	import { browser } from '$app/environment';
	import { provider } from '$lib/Chat';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: channel = decodeURIComponent(data.channel);

	let msgs: Message[];
	$: msgs_store = liveQuery(() =>
		browser ? db.messages.where('target').equals(channel).toArray() : []
	);
	$: msgs = $msgs_store as Message[];

	const addProvider = async () => {
		let ci: ConnectionInfo = {
			...default_config,
			name: 'ergo-testnet',
			display_name: 'Ergo Testnet',
			icon: default_icons[Math.floor(Math.random() * default_icons.length)],
			url: 'wss://testnet.ergo.chat/webirc'
		};

		let conn = $provider.add_persistent_connection(ci);
		conn.on_msg = saveMessage;
	};
</script>

<button on:click={() => $provider.connections[0][1].connect()}>connect to the thing</button>
<button on:click={() => addProvider()}>new thing</button>
<button on:click={() => $provider.connections[0][1].join_channel('#tubes')}>join #tubes</button>

{#if msgs}
	<button on:click={() => db.messages.bulkDelete(msgs.map((v) => v.id ?? 0))}>clear all</button>
	{channel}
	<div class="flex flex-col gap-1 min-w-full max-w-full">
		{#each msgs as msg (msg.id)}
			<MessageView {msg} />
		{/each}
	</div>
{/if}
