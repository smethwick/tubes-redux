<script lang="ts">
	import { goto } from '$app/navigation';
	import { quintOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import Donate from '../Dialogs/Donate.svelte';
	import MenuItem from './MenuItem.svelte';

	let isopen = false,
		donate = false,
		about = false;

	const duration = 150,
		easing = quintOut,
		opacity = 0.1;
</script>

<details bind:open={isopen} class="z-50 text-base">
	<summary
		class="list-none select-none hover:bg-neutral-200 active:bg-neutral-300
		cursor-pointer py-0.5 rounded px-1.5 text-sm"
	>
		⛺ tubes! <span class="text-xs">{isopen ? '▲' : '▼'}</span>
	</summary>
	{#if isopen}
		<div transition:fly={{ duration, easing, opacity, y: -5, x: -5 }}>
			<div
				transition:scale={{ duration, opacity, easing, start: 0.95 }}
				class="absolute mt-2 bg-purple-50 border border-neutral-200 rounded-lg shadow-xl w-56"
			>
				<MenuItem on:click={() => goto('/config')} icon="🔧">Configure Tubes…</MenuItem>
				<MenuItem on:click={() => donate = true} icon="💷">Donate…</MenuItem>
				<MenuItem icon="ℹ️">About…</MenuItem>
			</div>
		</div>
	{/if}
	{#if donate}
		<Donate close={() => donate = false} />
	{/if}
	{#if about}{/if}
</details>
