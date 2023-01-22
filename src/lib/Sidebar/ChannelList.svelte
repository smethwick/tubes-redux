<script lang="ts">
	import ChannelItem from './ChannelItem.svelte';
	type channel = [channel: string, unread: number, active: boolean, color: [string, string]];
	let channels: channel[] = [
		['#tubes', 1, true, ['', '']],
		['#tubes/test', 4, false, ['', '']]
	];
</script>

<ul class="flex flex-col my-2 gap-1">
	{#each channels as [channel, unread, active]}
		<ChannelItem {unread} {channel} {active} />
	{/each}
</ul>
