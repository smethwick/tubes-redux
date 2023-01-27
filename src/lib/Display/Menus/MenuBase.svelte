<script lang="ts">
	import { goto } from '$app/navigation';
	import { quintOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import Donate from '../Dialogs/Donate.svelte';
	import MenuItem from './MenuItem.svelte';

	let isopen = false;

	const duration = 150,
		easing = quintOut,
		opacity = 0.1;
</script>

<details bind:open={isopen} class="z-50">
	<summary
		class="list-none select-none hover:bg-neutral-200 active:bg-neutral-300
		cursor-pointer py-0.5 rounded px-1.5"
	>
		<slot name="text" /> <span class="text-xs">{isopen ? '▲' : '▼'}</span>
	</summary>
	{#if isopen}
		<div transition:fly={{ duration, easing, opacity, y: -8, x: -8 }}>
			<div
				transition:scale={{ duration, opacity, easing, start: 0.9 }}
				class="absolute mt-2 bg-purple-50 border border-neutral-200 rounded-lg shadow-xl w-56"
			>
				<slot />
			</div>
		</div>
	{/if}
</details>
