<script>
	import { provider } from '$lib/Chat';
	import { ProviderFlags } from '$lib/Chat/flags';
	import ChannelList from './ChannelList.svelte';
	import NetworkPicker from './NetworkPicker.svelte';
</script>

<aside class="sidebar min-w-[18rem] px-4 pt-2">
	{#if $provider.has_flag(ProviderFlags.MultipleConnections)}
		<NetworkPicker />
		<hr class="border border-neutral-300 border-dashed mx-1 my-2.5" />
	{/if}

	<ChannelList />
</aside>
