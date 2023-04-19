<script lang="ts">
	import Manifest from '$lib/Things/app.webmanifest';
	import '@fontsource/roboto-serif/variable-full.css';
	import '@fontsource/roboto-serif/variable-italic.css';
	import { onMount } from 'svelte';
	import '../app.css';
</script>

<svelte:head>
	<link rel="manifest" href={Manifest} />
	<meta name="theme-color" content="#fafafa" />
</svelte:head>

<div
	class="-z-50 h-screen overflow-hidden bg-white font-serif text-neutral-900
	dark:bg-neutral-900 dark:text-neutral-50"
>
	<slot />
</div>
