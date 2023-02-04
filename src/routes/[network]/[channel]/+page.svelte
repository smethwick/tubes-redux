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

	let open_sidebar: boolean;
</script>

<div class="flex h-full">
	<div class="flex flex-col h-full w-full">
		<TopBit bind:open_sidebar {channel} />
		{#key msgs}
			{#if msgs && msgs.length != 0}
				<MessageList {msgs} />
			{/if}
		{/key}
		<MessageInput {isConnected} {channel} channel_name={channel.name} />
	</div>

	{#if open_sidebar}
		<ChannelInfo {channel} />
	{/if}
</div>
