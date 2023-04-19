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

<ul class="my-2 flex h-full flex-col gap-1 overflow-y-auto pb-2">
	<SidebarItem {styles} href="./home">
		<span class="flex place-items-center gap-2"><House /> Home</span>
	</SidebarItem>
	{#each sorted as channel}
		<ChannelItem {styles} {channel} />
	{/each}
</ul>

<style>
	ul {
		scrollbar-gutter: stable;
	}
	ul::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	ul::-webkit-scrollbar-track {
		background: transparent;
	}

	ul::-webkit-scrollbar-thumb {
		background: #d3d3d3;
		border-radius: 8px;
	}

	ul::-webkit-scrollbar-thumb:hover {
		background: #747474;
		width: 10px;
		height: 12px;
	}
</style>
