<script lang="ts">
	import Lightbox from './Lightbox.svelte';
	import type { Media } from './richtext';

	export let media: Media[];

	const max = 3;
	const min = -3;

	let isopen = false;
	let open_media: Media | null = null;
</script>

<ul class="my-2 ml-40 flex gap-2">
	{#each media as media}
		<li>
			<button
				on:click={() => {
					isopen = true;
					open_media = media;
				}}
			>
				<img
					src={media.url}
					alt="Attached"
					class="-z-50 h-24 max-w-[8rem] rotate-[--rotation]
				cursor-zoom-in border-4 border-white object-cover shadow-md
				duration-150 ease-in-out hover:z-50 hover:rotate-0 hover:scale-125
				hover:shadow-lg"
					style="--rotation: {Math.floor(
						Math.random() * (max - min + 1) + min
					)}deg"
				/>
			</button>
		</li>
	{/each}
</ul>

{#if isopen && open_media}
	<Lightbox bind:isopen media={open_media} />
{/if}
