<script lang="ts">
	import TopBar from '$lib/Display/TopBar/TopBar.svelte';
	import Sidebar from '$lib/Display/Sidebar/Sidebar.svelte';
	import { provider } from '$lib/Chat';
	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';
	import type { LayoutData } from './$types';
	import Unsuppported from './Unsuppported.svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
	$: conn = data.connection;
</script>

{#if provider.supportsEnvironment && provider.supportsEnvironment()}
	<div class="h-screen bg-neutral-50 font-serif text-neutral-900">
		{#await provider.up()}
			hold on
		{:then}
			<TopBar />
			<div
				class="inner max-w-screen min-w-screen main-view h-full w-screen"
				in:fly={{ duration: 300, easing: circOut, opacity: 0, y: 8 }}
			>
				<Sidebar {conn} />
				{#key $page.params['network']}
					<main
						class="w-full min-w-full max-w-full overflow-y-auto overflow-x-hidden rounded-tl-md border-l
				border-t bg-white"
						in:fly|local={{ duration: 300, easing: circOut, opacity: 0, x: 18, delay: 300 }}
						out:fly|local={{ duration: 300, easing: circOut, opacity: 0, x: -18 }}
					>
						<slot />
					</main>
				{/key}
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

	.main-view {
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-template-rows: 100%;
	}
</style>
