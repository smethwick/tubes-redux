<script lang="ts">
	import { re_weburl } from '$lib/Chat/awful';
	import { Link, isALink } from './richtext';

	export let content: string | undefined;
	export let link_colour = 'inherit';
	
	content = content ?? '';
	const split = content.split(' ').map((o) => (re_weburl.test(o) ? new Link(o) : o));
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
		{#if isALink(thing)}
			<a
				class="underline"
				style="--color: {link_colour}"
				target="_blank"
				rel="noreferrer"
				href={thing.content}
			>
				{decodeURI(thing.content)}
			</a>
		{:else}
			{thing + ' '}
		{/if}
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
