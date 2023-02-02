<script lang="ts">
	import ChannelItem from './ChannelItem.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import House from 'phosphor-svelte/lib/House';
	import { provider } from '$lib/Chat';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import type { Writable } from 'svelte/store';
	import type { Channel } from '$lib/Chat/channel';

	export let conn: IrcConnection;

	let channels: Writable<Channel[]> = conn.get_channels_store_edition();


</script>

<ul class="flex flex-col my-2 gap-1">
	<SidebarItem href="./home"><span class="flex place-items-center gap-2"><House /> Home</span></SidebarItem>
	{#each $channels as channel}
		<ChannelItem {channel} />
	{/each}
</ul>
