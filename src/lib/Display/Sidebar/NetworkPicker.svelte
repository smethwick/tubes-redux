<script lang="ts">
	import type { ConnectionInfo, conn_styles } from '$lib/Chat/provider+connection';
	import type { Writable } from 'svelte/store';
	import NetworkItem from './NetworkItem.svelte';
	import NewNetwork from './NewNetwork.svelte';

	export let nets: Writable<(ConnectionInfo & { last_url: string, styles: conn_styles })[]>;
</script>

<ul class="flex gap-2 overflow-x-auto">
	{#each $nets as network}
		<NetworkItem {network} />
	{/each}
	<NewNetwork />
</ul>
