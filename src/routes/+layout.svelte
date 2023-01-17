<script lang="ts">
	import TopBar from '$lib/TopBar/TopBar.svelte';
	import Sidebar from '$lib/Sidebar/Sidebar.svelte';
	import Manifest from '$lib/Things/app.webmanifest';
	import '@fontsource/roboto-serif/variable-full.css';
	import '@fontsource/roboto-serif/variable-italic.css';
	import '../app.css';
	import { provider } from '$lib/Chat';
</script>

<svelte:head>
	<link rel="manifest" href={Manifest} />
	<meta name="theme-color" content="#f5f5f4" />
</svelte:head>

{#await $provider.up()}
	hold on
{:then}
	<div class="font-serif bg-stone-100 text-stone-900 h-screen flex flex-col">
		<TopBar />
		<div class="inner flex h-full w-screen">
			<Sidebar />
			<main class="bg-stone-50 border-t w-full border-l rounded-tl-md p-4 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>
{/await}

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
