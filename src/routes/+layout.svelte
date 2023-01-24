<script lang="ts">
	import Manifest from '$lib/Things/app.webmanifest';
	import '@fontsource/roboto-serif/variable-full.css';
	import '@fontsource/roboto-serif/variable-italic.css';
	import '../app.css';
</script>

<svelte:head>
	<link rel="manifest" href={Manifest} />
	<meta name="theme-color" content="#fafafa" />
</svelte:head>

<div class="font-serif bg-neutral-50 text-neutral-900 h-screen flex">
	<slot />
</div>
