<script lang="ts">
	import { provider } from '$lib/Chat';
	import NetworkItem from './NetworkItem.svelte';
	import NewNetwork from './NewNetwork.svelte';
</script>

<ul class="flex gap-2">
	{#each provider.get_connections() as [_, { connection_info: network }]}
		<NetworkItem {network} />
	{/each}
	<NewNetwork />
</ul>
