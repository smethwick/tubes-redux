<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';

	export let back: boolean = false;

	let previousPage: string = base;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

<header class="not-prose text-neutral-900">
	{#if back}
		<a
			class="flex px-3 py-1 bg-indigo-200 w-max 
			place-items-center gap-2 rounded-full text-sm
			mb-3 -ml-0.5"
			href={previousPage}
		>
			<ArrowLeft />
			Back
		</a>
	{/if}
	<p><slot name="above" /></p>
	<h1><slot /></h1>
</header>

<style>
	h1 {
		@apply text-4xl;
		font-stretch: extra-condensed;
	}
</style>
