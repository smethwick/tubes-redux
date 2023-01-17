<script>
	import { provider } from '$lib/Chat';
	import { Capability } from '$lib/Chat/caps';
	import NetworkPicker from './NetworkPicker.svelte';
</script>

<aside class="sidebar min-w-[18rem] px-4 pt-2">
	{#if $provider.supports(Capability.MultipleConnections)}
		<NetworkPicker />
	{/if}
</aside>

<style>
	.sidebar {
		-webkit-app-region: drag;
		app-region: drag;
	}
	.sidebar > * {
		-webkit-app-region: inital;
		app-region: inital;
	}
</style>
