<script lang="ts">
	import MessageList from './MessageList.svelte';
	import MessageInput from './MessageInput.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/Storage/db';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import type { Message } from '$lib/Storage/messages';
	import TopBit from './TopBit.svelte';
	import ChannelInfo from '$lib/Display/ChannelInfo/ChannelInfo.svelte';

	export let data: PageData;

	const { connection: conn } = data;
	$: network_name = data.network;
	$: channel = data.channel;
	const { isConnected } = conn;

	let msgs: Message[];
	$: msgs_store = liveQuery(async () =>
		browser
			? db.messages
					.where('target')
					.equals(channel.name)
					.and((item) => item.network == network_name)
					.toArray()
			: []
	);
	$: msgs = $msgs_store as Message[];

	$: open_sidebar = false;
</script>

<div class="flex w-full max-w-full h-full">
	<div class="flex flex-col w-full h-full">
		<TopBit bind:open_sidebar {channel} />
		{#key msgs}
			{#if msgs && msgs.length != 0}
				<MessageList {msgs} />
			{:else}
				<div class="min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4" />
			{/if}
		{/key}
		<MessageInput {isConnected} {channel} channel_name={channel.name} styles={conn.styles} />
	</div>
	<ChannelInfo bind:open={open_sidebar} styles={conn.styles} {channel} />
</div>
