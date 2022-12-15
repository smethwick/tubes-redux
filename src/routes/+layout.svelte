<script lang="ts">
    import TopBar from '$lib/TopBar/TopBar.svelte';
	import Sidebar from '$lib/Sidebar/Sidebar.svelte';
	import Manifest from '$lib/Things/app.webmanifest';
	import '@fontsource/roboto-serif/variable-full.css';
	import '@fontsource/roboto-serif/variable-italic.css';
	import '../app.css';
</script>

<svelte:head>
	<link rel="manifest" href={Manifest} />
	<meta name="theme-color" content="#f5f5f4">
</svelte:head>

<div class="font-serif bg-stone-100 text-stone-900 h-screen w-screen overflow-hidden">
	<TopBar />
	<div class="flex h-full">
		<Sidebar />
		<main class="bg-stone-50 border-t border-l w-full h-full rounded-tl-md p-4 overflow-y-scroll">
			<slot />
		</main>
	</div>
</div>
