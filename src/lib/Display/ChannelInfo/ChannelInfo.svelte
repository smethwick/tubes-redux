<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import Hash from 'phosphor-svelte/lib/Hash';
	import List from '../Lists/List.svelte';
	import Item from '../Lists/ListItem.svelte';
	import ListList from '../Lists/ListList.svelte';

	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import Recycle from 'phosphor-svelte/lib/Recycle';
	import type { conn_styles } from '$lib/Chat/provider+connection';

	export let styles: conn_styles;
	const { color_name: color } = styles;

	export let channel: Channel;
	$: nicks = channel.nicks_live;
	$: joined = channel.joined_live;
</script>

<aside class="sidebar min-w-[18rem] h-full p-4 border-l border-neutral-200">
	<div
		class="mx-auto mt-8 h-20 w-20 rounded-full flex justify-center place-items-center
		bg-{color}-300"
	>
		<Hash size={32} />
	</div>
	<div class="text-center my-4">
		<h3 class="text-xl font-semibold">{channel.name}</h3>
		<p>
			{#if $joined}
				{$nicks.length} {$nicks.length == 1 ? "Member" : "Members"}
			{/if}
		</p>
	</div>

	<ListList>
		<List title="Manage" bg="bg-{color}-200">
			<Item icon={Pencil}>Edit Topic</Item>
		</List>

		<List title="Extra Gubbins" bg="bg-{color}-200">
			<Item icon={Recycle}>Clear Logs</Item>
			<Item
				action={() => ($joined ? channel.part() : channel.join())}
				icon={$joined ? ArrowLeft : ArrowRight}
			>
				{$joined ? 'Leave' : 'Join'} Channel
			</Item>
		</List>

		<List title="Members" bg="bg-{color}-200">
			{#each $nicks as nick}
				<Item>{nick.name}</Item>
			{/each}
		</List>
	</ListList>

	<!-- {$nicks.map(o => o.name).join(", ")} -->
</aside>
