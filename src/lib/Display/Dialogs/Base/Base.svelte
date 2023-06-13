<script lang="ts">
	import { expoOut, quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';
	import Scrim from './Scrim.svelte';

	const duration = 200;

	export let isopen = false;

	let klass: string = '';
	export let width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' = 'max-w-xl';

	export let padding = 'p-8';

	export { klass as class };
</script>

{#if isopen}
	<Scrim let:open let:close bind:isopen transition_duration={duration} {width}>
		<div
			class="ext-black flex max-h-[50rem] flex-col
				overflow-y-auto rounded-md bg-white {padding} shadow-lg {klass}"
			transition:fly={{ duration, easing: expoOut, y: 50 }}
		>
			<slot {open} {close} />
		</div>
	</Scrim>
{/if}
