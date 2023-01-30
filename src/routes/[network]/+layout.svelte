<script lang="ts">
	import TopBar from '$lib/Display/TopBar/TopBar.svelte';
	import Sidebar from '$lib/Display/Sidebar/Sidebar.svelte';
	import { provider } from '$lib/Chat';
	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';
</script>

<div class="font-serif bg-neutral-50 text-neutral-900 h-screen flex flex-col">
	{#await $provider.up()}
		hold on
	{:then}
		<TopBar />
		<div
			class="inner flex h-full w-screen"
			in:fly={{ duration: 300, easing: circOut, opacity: 0, y: 8 }}
			out:fly={{ duration: 300, easing: circIn, opacity: 0, y: 8 }}
		>
			<Sidebar />
			<main class="bg-white border-t w-full border-l rounded-tl-md p-4 overflow-y-auto">
				<slot />
			</main>
		</div>
	{/await}
</div>

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
