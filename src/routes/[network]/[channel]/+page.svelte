<script lang="ts">
	import MessageInput from './MessageInput.svelte';

	import { liveQuery } from 'dexie';
	import { db } from '$lib/Storage/db';
	import { browser } from '$app/environment';
	import { provider } from '$lib/Chat';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { PageData } from './$types';
	import type { Message } from '$lib/Storage/messages';
	import TopBit from './TopBit.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	const { connection: conn } = data;
	$: network_name = data.network
	$: channel = data.channel;
	const { isConnected } = conn;

	let msgs: Message[];
	$: msgs_store = liveQuery(() =>
		browser
			? db.messages
					.where('target')
					.equals(channel.name)
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

<div class="flex flex-col h-full">
	<TopBit {channel} />
	{#if msgs}
		<div
			use:scrollToBottom={msgs}
			class="flex flex-col gap-0.5 min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4"
		>
			{#each msgs as msg (msg.id)}
				<MessageView {msg} />
			{/each}
		</div>
		<MessageInput {isConnected} {channel} channel_name={channel.name} />
	{/if}
</div>
