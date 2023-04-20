<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';
	import Scrim from './Scrim.svelte';

	const duration = 125;

	export let isopen = false;

	let klass: string = '';
	export let width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' = 'max-w-xl';

	export { klass as class };
</script>

{#if isopen}
	<Scrim let:open let:close bind:isopen {width}>
		<div transition:scale={{ duration, start: 0.95, easing: quadOut }}>
			<div
				class="ext-black flex max-h-[50rem] flex-col overflow-y-auto rounded-md bg-white p-8 shadow-lg {klass}"
				transition:fly={{ duration, easing: quadOut, y: 10 }}
			>
				<slot {open} {close} />
			</div>
		</div>
	</Scrim>
{/if}
