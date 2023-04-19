<script lang="ts">
	import MessageList from './MessageList.svelte';
	import MessageInput from './Input.svelte';
	import type { LayoutData } from './$types';
	import TopBit from './TopBit.svelte';
	import ChannelInfo from '$lib/Display/ChannelInfo/ChannelInfo.svelte';
	import UnreadBanner from './UnreadBanner.svelte';

	export let data: LayoutData;

	const { connection: conn } = data;
	const channel = data.channel;
	const { isConnected } = conn;

	$: open_sidebar = false;
</script>

<svelte:head>
	<title>{channel.name} • {conn.connection_info.display_name} • Tubes</title>
</svelte:head>

<div class="flex h-full w-full max-w-full">
	<div class="flex h-full w-full flex-col">
		{#key channel}
			<TopBit bind:open_sidebar {channel} />
			<MessageList {conn} {channel} />
			<UnreadBanner {channel} styles={conn.styles} />
			<MessageInput {isConnected} {channel} channel_name={channel.name} />
		{/key}
	</div>
	<ChannelInfo bind:open={open_sidebar} styles={conn.styles} {channel} />
</div>
