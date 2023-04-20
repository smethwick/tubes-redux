<script lang="ts">
	import { current_style } from '$lib/Chat';
	import Lightbox from './Lightbox.svelte';
	import type { Media } from './richtext';
	import Image from 'phosphor-svelte/lib/Image';

	export let media: Media[];
	export let colour_name: string;

    const max = 3;
    const min = -3;

	let isopen = false;
    let open_media: Media | null = null;
</script>

<ul class="my-2 ml-40 flex gap-2">
	{#each media as media }
		<li>
            <button on:click={() => {
                isopen = true;
                open_media = media;
            }}>
			<img
				src={media.url}
				alt="Attached"
				class="h-24 max-w-[8rem] object-cover rotate-[--rotation] border-white border-4 shadow-md"
				style="--rotation: {Math.floor(Math.random() * (max - min + 1) + min)}deg"
			/>
            </button>
		</li>
	{/each}
</ul>

{#if isopen && open_media}
	<Lightbox bind:isopen media={open_media} />
{/if}
