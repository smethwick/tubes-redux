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
	import { onMount } from 'svelte';
	import type { ChatFrame } from '$lib/Chat/logs';

	export let data: PageData;

	const { connection: conn } = data;
	$: channel = data.channel;
	const { isConnected } = conn;

	let frame: ChatFrame;

	$: open_sidebar = false;

	onMount(async () => {
		await channel.logs.open();
		frame = channel.logs.frames[0];
	});
</script>

<div class="flex w-full max-w-full h-full">
	<div class="flex flex-col w-full h-full">
		{#key channel}
			<TopBit bind:open_sidebar {channel} />
			{#if frame}
				<MessageList {channel} />
			{:else}
				<div class="min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4" />
			{/if}
		{/key}

		<MessageInput {isConnected} {channel} channel_name={channel.name} />
	</div>
	<ChannelInfo bind:open={open_sidebar} styles={conn.styles} {channel} />
</div>
