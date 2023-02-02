<script lang="ts">
	import { ChannelList } from '$lib/Chat/chan_list';
	import DisconnectedBanner from '$lib/Display/Network/DisconnectedBanner.svelte';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
	import type { PageData } from './$types';
	import BrowseChannelList from './BrowseChannelList.svelte';
	import SortingMenu from './SortingMenu.svelte';

	export let data: PageData;
	const { connection } = data;

	let list = new ChannelList(connection);
	let promise: Promise<ChannelList> = list.get_channels();
</script>

<Content>
	<Header>browse channels</Header>

	<input
		type="text"
		placeholder="🔎 find the thing"
		class="mt-8 mb-4 px-4 w-full rounded 
		border-neutral-300 bg-neutral-100 focus-visible:border-purple-500 
		py-3 text-xl"
	/>

	{#await promise}
		<div class="mx-auto">
			<p class="text-center italic text-xl mb-2">getting channels…</p>
			<p class="text-center text-sm mt-0">(this could take a second on big networks...)</p>
		</div>
	{:then list}
		<BrowseChannelList {list} />
	{/await}
</Content>
