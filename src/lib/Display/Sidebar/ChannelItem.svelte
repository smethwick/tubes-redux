<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';
	import type { Channel } from '$lib/Chat/channel';

	export let unread: number | undefined = undefined, channel: Channel;
</script>

<SidebarItem href="./{encodeURIComponent(channel.name.replaceAll('/', '%2F'))}">
	<span class="mr-auto flex gap-2 place-items-center"
		><Hash size={15} />{channel.name.replace('#', '')}</span
	>
	{#if unread}
		{unread}
	{/if}
</SidebarItem>
