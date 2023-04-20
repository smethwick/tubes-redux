<script lang="ts">
	import { page } from '$app/stores';
	import { provider } from '$lib/Chat';
	import { ProviderFlags } from '$lib/Chat/flags';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import ChannelList from './ChannelList.svelte';
	import NetworkPicker from './NetworkPicker.svelte';

	export let conn: IrcConnection;
	const nets = provider.get_connections_for_the_sidebar_and_nothing_else();

	$: styles = $nets.find(o => o.name == $page.params['network'])?.styles;
</script>

<aside class="sidebar min-h-full h-full flex flex-col min-w-[18rem] w-[18rem] max-w-[18rem] px-4 pt-2">
	{#if provider.has_flag(ProviderFlags.MultipleConnections)}
		<NetworkPicker {nets} />
		<hr class="border border-neutral-300 border-dashed mx-1 mt-2 mb-0.5" />
	{/if}
	<ChannelList {conn} {styles} />
</aside>