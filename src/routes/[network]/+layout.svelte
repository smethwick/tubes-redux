<script lang="ts">
	import TopBar from '$lib/TopBar/TopBar.svelte';
	import Sidebar from '$lib/Sidebar/Sidebar.svelte';
	import { provider } from '$lib/Chat';
</script>


{#await $provider.up()}
	hold on
{:then}
	<div class="font-serif bg-neutral-50 text-neutral-900 h-screen flex flex-col">
		<TopBar />
		<div class="inner flex h-full w-screen">
			<Sidebar />
			<main class="bg-white border-t w-full border-l rounded-tl-md p-4 overflow-y-auto">
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
