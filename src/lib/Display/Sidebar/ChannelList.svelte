<script lang="ts">
	import ChannelItem from './ChannelItem.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import House from 'phosphor-svelte/lib/House';
	import type { conn_styles, IrcConnection } from '$lib/Chat/provider+connection';

	export let conn: IrcConnection;
	export let styles: conn_styles | undefined;

	$: channels = conn.get_channels_store_edition();
	$: sorted = $channels.sort((a, b) => a.name.localeCompare(b.name));
</script>

<ul class="flex flex-col my-2 pb-2 gap-1 overflow-y-auto h-full">
	<SidebarItem {styles} href="./home">
		<span class="flex place-items-center gap-2"><House /> Home</span>
	</SidebarItem>
	{#each sorted as channel}
		<ChannelItem {styles} {channel} />
	{/each}
</ul>
