<script lang="ts">
	import ChannelItem from './ChannelItem.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import House from 'phosphor-svelte/lib/House';
	import { provider } from '$lib/Chat';

	type channel = [channel: string, unread?: number, color?: [string, string]];
	let channels: string[] = provider.connections[0][1].connection_info.channels;
</script>

<ul class="flex flex-col my-2 gap-1">
	<SidebarItem href="./home"><span class="flex place-items-center gap-2"><House /> Home</span></SidebarItem>
	{#each channels as channel}
		<ChannelItem {channel} />
	{/each}
</ul>
