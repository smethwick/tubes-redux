<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let klass: string = '';
	export let inside_class = '';

	let isopen = false;
	export { klass as class };
</script>

<details class="mt-4 {klass}" bind:open={isopen}>
	<summary class="cursor-pointer list-none flex place-items-center gap-3">
        <div class="prose prose-sm select-none">
            <slot name="summary" />
		</div>
        <div class="spinny-thing ml-auto text-neutral-700" class:isopen aria-hidden>▼</div>
	</summary>
</details>
{#if isopen}
	<div transition:slide={{ duration: 250, easing: quintOut }} class={inside_class}>
		<slot />
	</div>
{/if}

<style>
	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.isopen {
		rotate: 180deg;
	}
    .spinny-thing {
        transition: rotate 250ms cubic-bezier(0.23, 1, 0.320, 1);
    }
</style>
