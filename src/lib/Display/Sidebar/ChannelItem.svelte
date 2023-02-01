<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';

	export let unread: number | undefined = undefined, channel: string;
</script>

<SidebarItem href="./{encodeURIComponent(channel.replaceAll('/', '%2F'))}">
	<span class="mr-auto flex gap-2 place-items-center"
		><Hash size={15} />{channel.replace('#', '')}</span
	>
	{#if unread}
		{unread}
	{/if}
</SidebarItem>
