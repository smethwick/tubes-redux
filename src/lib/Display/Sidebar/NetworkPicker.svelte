<script lang="ts">
	import type { ConnectionInfo, conn_styles } from '$lib/Chat/provider+connection';
	import type { Writable } from 'svelte/store';
	import NetworkItem from './NetworkItem.svelte';
	import NewNetwork from './NewNetwork.svelte';

	export let nets: Writable<(ConnectionInfo & { last_url: string; styles: conn_styles })[]>;
</script>

<ul class="flex min-h-[2.5rem] gap-2 pb-2 overflow-x-auto overflow-y-hidden">
	{#each $nets as network}
		<NetworkItem {network} />
	{/each}
	<NewNetwork />
</ul>

<style>
	ul::-webkit-scrollbar {
		width: 10px;
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
