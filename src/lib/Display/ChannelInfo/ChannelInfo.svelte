<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import Hash from 'phosphor-svelte/lib/Hash';
	import List from '../Lists/List.svelte';
	import Item from '../Lists/ListItem.svelte';
	import ListList from '../Lists/ListList.svelte';

	import SignOut from 'phosphor-svelte/lib/SignOut';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import Recycle from 'phosphor-svelte/lib/Recycle';

	export let channel: Channel;
	$: nicks = channel.nicks_live;
</script>

<aside class="sidebar min-w-[18rem] h-full p-4 border-l border-neutral-200">
	<div
		class="mx-auto mt-8 h-20 w-20 rounded-full flex justify-center place-items-center bg-pink-200"
	>
		<Hash size={32} />
	</div>
	<div class="text-center my-4">
		<h3 class="text-xl font-semibold">{channel.name}</h3>
		<p>{$nicks.length} Members</p>
	</div>

	<ListList>
		<List title="Manage">
			<Item icon={Pencil}>Edit Topic</Item>
		</List>

		<List title="Extra Gubbins" bg="bg-indigo-200">
			<Item icon={Recycle}>Clear Logs</Item>
			<Item icon={SignOut}>Leave Channel</Item>
		</List>

		<List title="Members" bg="bg-emerald-200">
			{#each $nicks as nick}
				<Item>{nick.name}</Item>
			{/each}
		</List>
	</ListList>

	<!-- {$nicks.map(o => o.name).join(", ")} -->
</aside>
