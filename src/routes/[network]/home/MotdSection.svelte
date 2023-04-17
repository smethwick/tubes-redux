<script lang="ts">
	import type { LayoutData } from './$types';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Writable } from 'svelte/store';

	export let notconnected: boolean;
	export let motd: Writable<string>;
	export let duration: number;

	const other_transition = (n: Element, opt?: { delay: number }) =>
		fade(n, { duration, easing: quintOut, delay: duration ? opt?.delay : 0 });
</script>

<section
	class="fade"
	in:other_transition|local={{ delay: 100 }}
	out:other_transition|local
	class:disconnected={notconnected}
	aria-hidden={notconnected}
>
	{#if $motd}
		<h2>Message of the Day</h2>
		<pre style="white-space: pre-wrap;">{$motd}</pre>
	{/if}
</section>

<style>
	h2 {
		@apply text-2xl mb-2 font-[450];
		font-stretch: condensed;
	}
</style>
