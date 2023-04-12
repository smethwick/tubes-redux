<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';
	import type { Channel } from '$lib/Chat/channel';
	import type { conn_styles } from '$lib/Chat/provider+connection';
	import UnreadMarker from './UnreadMarker.svelte';

	export let styles: conn_styles | undefined, channel: Channel;

	$: unread = channel.session.unread_live;
</script>

<SidebarItem {styles} href="./{encodeURIComponent(channel.name.replaceAll('/', '%2F'))}">
	<span class="mr-auto flex place-items-center gap-2">
		<Hash size={15} />{channel.name}
	</span>
	{#if $unread}<UnreadMarker>{$unread}</UnreadMarker>{/if}
</SidebarItem>
