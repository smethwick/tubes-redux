<script lang="ts">
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
	import SortingMenu from './SortingMenu.svelte';

	let value: string = 'bumpscosity';

	let channels: [string, string, number][] = [['#tubes', 'the tube zone', 15]];
</script>

<Content>
	<Header>browse channels</Header>

	<input
		type="text"
		placeholder="🔎 find a thing"
		class="mt-8 mb-4 px-4 w-full rounded border-neutral-300 bg-neutral-100 shadow py-3 text-xl"
	/>

	<div class="flex">
		<span class="mr-auto">{channels.length} {channels.length == 1 ? 'result' : 'results'}</span>
		<span class="flex place-items-center gap-1">sorting by <SortingMenu bind:value /></span>
	</div>

	<ul class="flex flex-col gap-4 my-4 list-none px-0">
		{#each channels as [name, desc, members]}
			<li>
				<p class="float-right my-0">{members} {members == 1 ? 'member' : 'members'}</p>
				<h3 class="mt-0 mb-2">{name}</h3>
				<p class="mb-0">{desc}</p>
			</li>
		{/each}
	</ul>
</Content>
