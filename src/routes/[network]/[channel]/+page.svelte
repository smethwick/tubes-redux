<script lang="ts">
	import MessageInput from './MessageInput.svelte';

	import { liveQuery } from 'dexie';
	import { db } from '$lib/Storage/db';
	import { browser } from '$app/environment';
	import { provider } from '$lib/Chat';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { PageData } from './$types';
	import type { Message } from '$lib/Storage/messages';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import TopBit from './TopBit.svelte';

	export let data: PageData;
	let input = '';

	const { network: network_name, connection: conn } = data;
	const { isConnected } = conn;

	$: channel_name = decodeURIComponent(data.channel);
	$: channel = conn.get_channel(channel_name);

	let msgs: Message[];
	$: msgs_store = liveQuery(() =>
		browser
			? db.messages
					.where('target')
					.equals(channel_name)
					.and((item) => item.network == network_name)
					.toArray()
			: []
	);
	$: msgs = $msgs_store as Message[];

	const scrollToBottom = (node: HTMLDivElement, list: Array<unknown>) => {
		const scroll = (list: Array<unknown>) =>
			node.scroll({
				top: node.scrollHeight,
				behavior: 'smooth'
			});
		scroll(list);

		return { update: scroll };
	};
</script>

<!-- <button on:click={() => provider.connections[0][1].connect()}>connect to the thing</button>
<button on:click={() => addProvider()}>new thing</button>
<button on:click={() => provider.connections[0][1].join_channel('#tubes')}>join #tubes</button> -->

{#key channel}
	<div class="flex flex-col h-full">
		<TopBit channel={channel_name} />
		{#if msgs}
			<div
				use:scrollToBottom={msgs}
				class="flex flex-col gap-1 min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4"
			>
				{#each msgs as msg (msg.id)}
					<MessageView {msg} />
				{/each}
			</div>
			<MessageInput {isConnected} {channel} {channel_name} {conn} />
		{/if}
	</div>
{/key}

<style>
	.disabled {
		@apply italic;
	}
</style>
