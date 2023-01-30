<script lang="ts">
	import ChannelItem from './ChannelItem.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import House from 'phosphor-svelte/lib/House';

	type channel = [channel: string, unread: number, active: boolean, color: [string, string]];
	let channels: channel[] = [
		['#tubes', 1, true, ['', '']],
		['#tubes/test', 4, false, ['', '']]
	];
</script>

<ul class="flex flex-col my-2 gap-1">
	<SidebarItem href="./home"><span class="flex place-items-center gap-2"><House /> Home</span></SidebarItem>
	{#each channels as [channel, unread, active]}
		<ChannelItem {unread} {channel} {active} />
	{/each}
</ul>
