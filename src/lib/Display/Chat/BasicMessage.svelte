<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	let klass: string = '';
	export let outer_class: string = '';
	export { klass as class };
	import dayjs from 'dayjs';

	export let timestamp: Date | undefined = undefined;
</script>

<article class="my-1 py-0.5 {outer_class}">
	<div
		class="flex 
		{$message_layout == 'comfy'
			? 'flex-col justify-start place-items-start px-4 py-1 my-1'
			: 'place-items-start gap-3'} 
			rounded {klass}"
	>
		<span
			class="{$message_layout == 'comfy'
				? 'text-sm'
				: 'w-32 min-w-[8rem] '} text-right font-semibold overflow-ellipsis overflow-hidden 
				whitespace-nowrap"
		>
			<slot name="sender" />
		</span>
		<p class="w-full"><slot name="content" /></p>
		{#if timestamp}
			<time class="ml-auto text-sm text-neutral-700">{dayjs(timestamp).format('hh:mm')}</time>
		{/if}
	</div>
	<slot name="after" />
</article>

