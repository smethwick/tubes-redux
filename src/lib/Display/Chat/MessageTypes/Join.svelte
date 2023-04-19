<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import MessageTemplate from '../MessageTemplate.svelte';

	export let msg: Message;

	const { source: full_source, target, timestamp } = msg;
	const source = full_source ? full_source[0] : 'Unknown';
	const nick = new Nick(source);
</script>

<MessageTemplate
	{timestamp}
	class="place-items-center text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
	highlight={nick.color[2]}
>
	<span
		class="flex place-items-center justify-end font-bold text-cyan-700"
		aria-hidden
		slot="sender"
	>
		<ArrowRight weight="bold" />
	</span>
	<span slot="content">
		<b class={nick.color[0]}>{nick.name}</b> has joined <b>{target}</b>
	</span>
</MessageTemplate>

<style>
	b {
		@apply font-semibold;
	}
</style>
