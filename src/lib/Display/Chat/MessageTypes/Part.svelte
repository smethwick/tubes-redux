<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import MessageTemplate from '../MessageTemplate.svelte';

	export let msg: Message;
	const { source: full_source, content, target, timestamp } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>
 
<MessageTemplate {timestamp} class="text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 place-items-center" highlight={nick.color[2]}>
	<span
		class="text-pink-700 font-bold flex justify-end place-items-center"
		aria-hidden
		slot="sender"
	>
		<ArrowLeft weight="bold" />
	</span>
	<span slot="content">
		<b class={nick.color[0]}>{nick.name}</b> has left <b>{target}</b>
		{content && content != target ? `(${content})` : ''}
	</span>
</MessageTemplate>

<style>
	b {
		@apply font-semibold;
	}
</style>
