<script lang="ts">
	import { re_weburl } from '$lib/Chat/awful';
	import MediaPreview from './MediaPreview.svelte';
	import { Link, Media, MediaType, link_schema, media_schema } from './richtext';

	const re_img = /[^\s]+(.*?).(jpg|jpeg|png|gif)$/;

	export let content: string | undefined;
	export let link_colour = 'inherit';
	export let colour_name: string;

	content = content ?? '';
	const split = content.split(' ').map((o) => {
		if (re_img.test(o)) return new Media(o, MediaType.Image);
		if (re_weburl.test(o)) return new Link(o);
		return o;
	});
</script>

<!--
@component
Some text with fancy formatting.

This will:
- Turn the URLs into clickable links.
- Try and generate media previews for URLs that are definately media.
-->
<span style="display: inline">
	{#each split as thing}
		{#await media_schema.parseAsync(thing) then thing}
			<MediaPreview {colour_name} media={thing} />
		{:catch}
			{#await link_schema.parseAsync(thing) then thing}
				<a
					class="underline"
					style="--color: {link_colour}"
					target="_blank"
					rel="noreferrer"
					href={thing.content}
				>
					{decodeURI(thing.content)}
				</a>
			{:catch}
				{thing + ' '}
			{/await}
		{/await}
	{/each}
</span>

<style>
	a:hover {
		color: var(--color);
	}
	a:active {
		background-color: var(--color);
		color: white;
	}
</style>
