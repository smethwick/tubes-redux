<script lang="ts">
	import TopBar from '$lib/Display/TopBar/TopBar.svelte';
	import Sidebar from '$lib/Display/Sidebar/Sidebar.svelte';
	import { provider } from '$lib/Chat';
	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';
	import type { LayoutData } from './$types';
	import Unsuppported from './Unsuppported.svelte';

	export let data: LayoutData;
	$: conn = data.connection;
</script>

{#if provider.supportsEnvironment()}
	<div class="font-serif bg-neutral-50 text-neutral-900 h-screen flex flex-col">
		{#await provider.up()}
			hold on
		{:then}
			<TopBar />
			<div
				class="inner flex h-full w-screen"
				in:fly={{ duration: 300, easing: circOut, opacity: 0, y: 8 }}
			>
				<Sidebar {conn} />
				<main class="bg-white border-t w-full border-l rounded-tl-md overflow-x-hidden overflow-y-auto">
					<slot />
				</main>
			</div>
		{/await}
	</div>
{:else}
	<Unsuppported />
{/if}

<!-- this is one hell of a hack. sorry about that -->
<style>
	.inner {
		padding-top: 2rem;
	}
	@media (display-mode: window-controls-overlay) {
		.inner {
			padding-top: calc(env(titlebar-area-height) + 0.5rem);
		}
	}
</style>
