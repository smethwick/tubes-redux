<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';

	import BasicMessage from '../BasicMessage.svelte';

	export let msg: Message;
	const { source: full_source, target, timestamp } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>

<BasicMessage {timestamp} class="text-sm hover:bg-neutral-50 place-items-center">
	<span
		class="text-cyan-700 font-bold flex justify-end place-items-center"
		aria-hidden
		slot="sender"
	>
		<ArrowRight weight="bold" />
	</span>
	<span slot="content">
		<b class={nick.color[0]}>{nick.name}</b> has joined <b>{target}</b>
	</span>
</BasicMessage>

<style>
	b {
		@apply font-semibold;
	}
</style>
