<script lang="ts">
	import { provider } from '$lib/Chat';
	import NetworkItem from './NetworkItem.svelte';
</script>

<ul class="flex gap-2">
	{#each $provider.connections as [_, { connection_info: network }]}
		<NetworkItem {network} />
	{/each}
</ul>
