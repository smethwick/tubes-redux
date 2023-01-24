<script lang="ts">
	import { liveQuery } from 'dexie';
	import { db } from '$lib/Storage/db';
	import { browser } from '$app/environment';
	import { provider } from '$lib/Chat';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { PageData } from './$types';
	import type { Message } from '$lib/Storage/messages';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let data: PageData;
	let input = '';

	const { network: network_name } = data;
	const potential_connection = $provider.connections.find((o) => o[0] === network_name);
	if (!potential_connection) throw error(404);
	const [_, conn] = potential_connection;
	const { isConnected } = conn;

	$: channel = decodeURIComponent(data.channel);

	let msgs: Message[];
	$: msgs_store = liveQuery(() =>
		browser ? db.messages.where('target').equals(channel).toArray() : []
	);
	$: msgs = $msgs_store as Message[];

	const scrollToBottom = (node: HTMLDivElement, list: Array<unknown>) => {
		console.log("here");
		const scroll = (list: Array<unknown>) =>
			node.scroll({
				top: node.scrollHeight,
				behavior: 'smooth'
			});
		scroll(list);

		return { update: scroll };
	};
</script>

<!-- <button on:click={() => $provider.connections[0][1].connect()}>connect to the thing</button>
<button on:click={() => addProvider()}>new thing</button>
<button on:click={() => $provider.connections[0][1].join_channel('#tubes')}>join #tubes</button> -->

{#key channel}
	<div class="flex flex-col h-full">
		<button on:click={() => db.messages.bulkDelete(msgs.map((v) => v.id ?? 0))}>clear all</button>
		{channel}
		{#if msgs}
			<div
				use:scrollToBottom={msgs}
				class="flex flex-col gap-1 min-w-full max-w-full overflow-y-auto h-full max-h-screen py-4"
			>
				{#each msgs as msg (msg.id)}
					<MessageView {msg} />
				{/each}
			</div>
			<input
				class="w-full border-t px-4 pt-3 focus-visible:outline-none"
				placeholder={$isConnected ? `say something to ${channel}` : 'not connected to this network'}
				bind:value={input}
				disabled={!$isConnected}
				class:disabled={!$isConnected}
				on:keydown={(e) => {
					if (e.key == 'Enter') {
						conn.privmsg(channel, input);
						input = '';
					}
				}}
			/>
		{/if}
	</div>
{/key}

<style>
	.disabled {
		@apply italic;
	}
</style>
