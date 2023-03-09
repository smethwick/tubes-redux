<script lang="ts">
	import { ChannelCollector, type ListEntry } from '$lib/Chat/chan_list';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
	import type { PageData } from './$types';
	import BrowseChannelList from './BrowseChannelList.svelte';
	import * as lscache from 'lscache';

	export let data: PageData;
	const { connection } = data;

	const key = `channels:${connection.connection_info.name}`;

	async function refresh() {
		lscache.remove(key);
		lscache.flush();
		promise = get_chans();
	}

	$: promise = get_chans();

	async function get_chans(): Promise<Array<ListEntry>> {
		let cached: Array<ListEntry> = lscache.get(key);
		console.log(cached);
		if (cached != null && cached.length != 0) return cached;

		let channels = await ChannelCollector.get_channels(connection);
		lscache.set(key, channels, 30);
		return channels;
	}
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
		<BrowseChannelList {refresh} {list} conn={connection} />
	{/await}
</Content>
