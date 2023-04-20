<script lang="ts">
	import { Target } from 'phosphor-svelte';
	import { quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

	const duration = 125;

	export let isopen = false;

	let div: Element;

	let open = () => {
		isopen = true;
	};
	let close = () => {
		isopen = false;
	};

	export let width: 'max-w-max' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' = 'max-w-xl';
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key == 'Escape') close();
	}}
/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="absolute left-0 top-0 z-[9999]
    flex h-screen w-screen place-items-center justify-center bg-black/70"
	transition:fade={{ duration }}
	bind:this={div}
	on:click={(e) => {
		if (e.target == div) close();
	}}
>
	<dialog open class="{width} w-full bg-transparent">
		<slot {open} {close} />
	</dialog>
</div>
