<script lang="ts">
	import { current_style } from '$lib/Chat';
	import Lightbox from './Lightbox.svelte';
	import type { Media } from './richtext';
	import Image from 'phosphor-svelte/lib/Image';

	export let media: Media;

	let isopen = false;
</script>

<button class="group inline-flex text-sm" on:click={() => isopen = true}>
	<span
		class="
    bg-{$current_style.color_name}-300 group-hover:bg-{$current_style.color_name}-400
    flex place-items-center rounded-l-md px-2 py-1"
	>
		<Image weight="fill" />
	</span>
	<span
		class="bg-{$current_style.color_name}-200 group-hover:bg-{$current_style.color_name}-300
    rounded-r-md px-2 py-1"
	>
		{new URL(media.url).host}
	</span>
</button>

{#if isopen}
<Lightbox bind:isopen {media} />
{/if}