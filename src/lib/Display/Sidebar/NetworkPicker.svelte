<script lang="ts">
	import { provider } from '$lib/Chat';
	import NetworkItem from './NetworkItem.svelte';
	import NewNetwork from './NewNetwork.svelte';

	const nets = provider.get_connections_for_the_sidebar_and_nothing_else();
</script>

<ul class="flex gap-2">
	{#each $nets as network}
		<NetworkItem {network} />
	{/each}
	<NewNetwork />
</ul>
