<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	let klass: string = '';
	export let outer_class: string = '';
	export { klass as class };
	import dayjs from 'dayjs';

	export let timestamp: Date | undefined = undefined;
	export let highlight: string | undefined = undefined;
</script>

<article class="my-1 py-0.5 {outer_class}" style="--highlight-color: {highlight ? highlight : 'inherit'}">
	<div
	class="flex 
	{$message_layout == 'comfy'
			? 'flex-col justify-start place-items-start px-4 py-1 my-1'
			: 'place-items-start gap-3'} 
			rounded {klass}"
			>
			{#if timestamp}
				<time class="text-xs mt-1 text-neutral-700">{dayjs(timestamp).format('HH:mm')}</time>
			{/if}
		<span
			class="{$message_layout == 'comfy'
				? 'text-sm'
				: 'w-24 min-w-[6rem] '} text-right font-semibold overflow-ellipsis overflow-hidden 
				whitespace-nowrap"
		>
			<slot name="sender" />
		</span>
		<p class="w-full"><slot name="content" /></p>
	</div>
	<slot name="after" />
</article>
