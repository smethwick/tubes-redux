<script lang="ts">
	import { goto } from '$app/navigation';
	import { quintOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import CaretUp from 'phosphor-svelte/lib/CaretUp';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';

	let klass = '';
	let isopen = false;
	const close_menu = () => (isopen = false);

	const duration = 150,
		easing = quintOut,
		opacity = 0.1;

	export { klass as class };
</script>

<details bind:open={isopen} class="relative z-50 w-max">
	<summary
		class="flex w-max cursor-pointer select-none list-none place-items-center
		gap-1 rounded px-1.5 py-0.5 hover:bg-neutral-200 active:bg-neutral-300 
		dark:hover:bg-neutral-800"
	>
		<slot name="text" />
		<span class="text-xs">
			<svelte:component this={isopen ? CaretUp : CaretDown} />
		</span>
	</summary>
	{#if isopen}
		<div transition:fly={{ duration, easing, opacity, y: -8, x: -8 }}>
			<div
				transition:scale={{ duration, opacity, easing, start: 0.9 }}
				class="absolute mt-2 w-56 rounded-lg border border-neutral-200 bg-purple-50 text-base shadow-xl {klass}"
			>
				<slot {close_menu} />
			</div>
		</div>
	{/if}
</details>
