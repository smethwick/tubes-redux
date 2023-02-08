<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ListEntry } from '$lib/Chat/chan_list';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import MiniButton from '$lib/Display/Buttons/MiniButton.svelte';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import ArrowsClockwise from 'phosphor-svelte/lib/ArrowsClockwise';
	import { writable } from 'svelte/store';
	import NoResults from './NoResults.svelte';
	import SortingMenu from './SortingMenu.svelte';

	export let list: ListEntry[];
	let sorted = list;
	let sorting_mode = 'a-z';
	let limit = 100;
	export let refresh: () => void;
	export let conn: IrcConnection;

	update(sorting_mode);

	function update(new_value: string) {
		sorting_mode = new_value;
		if (new_value == 'bumpscosity') sorted = list.sort(() => 0.5 - Math.random());
		if (new_value == 'members') sorted = list.sort((a, b) => (a[1] > b[1] ? -1 : 1));
		if (new_value == 'a-z') sorted = list.sort((a, b) => a[0].localeCompare(b[0]));
	}
</script>

<div class="flex">
	<span class="mr-auto">{list.length} {list.length == 1 ? 'result' : 'results'}</span>
	<MiniButton on:click={() => refresh()}><ArrowsClockwise size={14} /> refresh…</MiniButton>
	<span class="flex place-items-center gap-1 ml-2">
		sorting by
		<SortingMenu update={(new_value) => update(new_value)} bind:value={sorting_mode} />
	</span>
</div>

<ul class="my-4 mx-0 list-none px-0">
	{#each sorted as [name, members, topic], i}
		{#if i <= limit}
			<li class="w-full pl-0">
				<button
					class="hover:bg-neutral-100 active:bg-neutral-200 px-2.5 py-2 rounded text-left m-0 w-full overflow-clip"
					on:click={async () => {
						await conn.join_persistent_channel(name);
						goto(`./${encodeURIComponent(name.replaceAll('/', '%2F'))}/`);
						name = '';
					}}
				>
					<p class="float-right my-0">{members} {members == 1 ? 'member' : 'members'}</p>
					<h3 class="mt-0 mb-2">{name}</h3>
					<p class="mb-0">{topic}</p>
				</button>
			</li>
		{/if}
	{:else}
		<NoResults />
	{/each}

	{#if sorted && limit <= sorted.length}
	<PrimaryButton class="mx-auto mt-4" on:click={() => limit = limit + 100}>Show More</PrimaryButton>
	{/if}
</ul>
