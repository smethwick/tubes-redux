<script lang="ts">
	import type { ListEntry } from '$lib/Chat/chan_list';
	import { writable } from 'svelte/store';
	import SortingMenu from './SortingMenu.svelte';

	export let list: ListEntry[];
	let sorted = writable(list);
	let sorting_mode = writable('members');

    update($sorting_mode);

	function update(new_value: string) {
		sorting_mode.set(new_value);
		if (new_value == 'bumpscosity') sorted.set(list.sort(() => 0.5 - Math.random()));
		if (new_value == 'members') sorted.set(list.sort((a, b) => (a[1] > b[1] ? -1 : 1)));
		if (new_value == 'az') sorted.set(list.sort((a, b) => a[0].localeCompare(b[0])));
	}
</script>

<div class="flex">
	<span class="mr-auto">{list.length} {list.length == 1 ? 'result' : 'results'}</span>
	<span class="flex place-items-center gap-1">
		sorting by
		<SortingMenu update={(new_value) => update(new_value)} bind:value={$sorting_mode} />
	</span>
</div>

<ul class="flex flex-col gap-4 my-4 list-none px-0">
	{#each $sorted as [name, members, topic]}
		<li>
			<p class="float-right my-0">{members} {members == 1 ? 'member' : 'members'}</p>
			<h3 class="mt-0 mb-2">{name}</h3>
			<p class="mb-0">{topic}</p>
		</li>
	{/each}
</ul>
