<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import dayjs from 'dayjs';

	let klass: string = '';
	export { klass as class };
	export let outer_class: string = '';
	export let timestamp: Date | undefined = undefined;
	export let highlight: string | undefined = undefined;
</script>

<!--
	@component
	This place is a message... and part of a system of messages... pay attention to it!
    Sending this message was important to us. We considered ourselves to be a powerful culture.
    This place is not a place of honor... no highly esteemed deed is commemorated here... nothing valued is here.
    What is here was dangerous and repulsive to us. This message is a warning about danger.
    The danger is in a particular location... it increases towards a center... the center of danger is here... of a particular size and shape, and below us.
    The danger is still present, in your time, as it was in ours.
    The danger is to the body, and it can kill.
    The form of the danger is an emanation of energy.
    The danger is unleashed only if you substantially disturb this place physically. This place is best shunned and left uninhabited.
-->

<article
	class="my-1 py-0.5 {outer_class}"
	style="--highlight-color: {highlight ? highlight : 'inherit'}"
>
	<div
		class="flex
	{$message_layout == 'comfy'
			? 'my-1 flex-col place-items-start justify-start px-4 py-1'
			: 'place-items-start gap-3'} 
			rounded {klass}"
	>
		{#if timestamp}
			<time class="mt-1 w-12 text-xs text-neutral-700 dark:text-neutral-300">{dayjs(timestamp).format('HH:mm')}</time>
		{:else}
			<div class="w-12" />
		{/if}
		<span
			class="{$message_layout == 'comfy'
				? 'text-sm'
				: 'w-24 min-w-[6rem]'} overflow-hidden overflow-ellipsis whitespace-nowrap text-right
				font-semibold"
		>
			<slot name="sender" />
		</span>
		<p class="w-full break-words"><slot name="content" /></p>
	</div>
	<slot name="after" />
</article>
