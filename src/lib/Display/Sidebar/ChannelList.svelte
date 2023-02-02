<script lang="ts">
	import ChannelItem from './ChannelItem.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import House from 'phosphor-svelte/lib/House';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	export let conn: IrcConnection;

	$: channels = conn.get_channels_store_edition();
</script>

<ul class="flex flex-col my-2 gap-1">
	<SidebarItem href="./home"><span class="flex place-items-center gap-2"><House /> Home</span></SidebarItem>
	{#each $channels as channel}
		<ChannelItem {channel} />
	{/each}
</ul>
