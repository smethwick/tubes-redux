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
	import { MessageLogList } from '$lib/Chat/logs';

	export let data: PageData;

	const { connection: conn } = data;
	$: channel = data.channel;
	const { isConnected } = conn;

	$: open_sidebar = false;
</script>

<svelte:head>
	<title>{channel.name} • {conn.connection_info.display_name} • Tubes</title>
</svelte:head>

<div class="flex w-full max-w-full h-full">
	<div class="flex flex-col w-full h-full">
		{#key channel}
			<TopBit bind:open_sidebar {channel} />
			<MessageList {conn} {channel} />
		{/key}

		<MessageInput {isConnected} {channel} channel_name={channel.name} />
	</div>
	<ChannelInfo bind:open={open_sidebar} styles={conn.styles} {channel} />
</div>
