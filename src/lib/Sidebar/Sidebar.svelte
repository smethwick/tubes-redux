<script>
	import { provider } from '$lib/Chat';
	import { Capability } from '$lib/Chat/caps';
	import ChannelList from './ChannelList.svelte';
	import NetworkPicker from './NetworkPicker.svelte';
</script>

<aside class="sidebar min-w-[18rem] px-4 pt-2">
	{#if $provider.supports(Capability.MultipleConnections)}
		<NetworkPicker />
		<hr class="border border-neutral-300 border-dashed mx-1 my-2.5">
	{/if}

	<ChannelList />
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
