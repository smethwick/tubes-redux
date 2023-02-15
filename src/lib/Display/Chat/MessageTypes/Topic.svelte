<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';
	import Pencil from 'phosphor-svelte/lib/PencilSimple';

	export let msg: Message;
	const { source: full_source, content, timestamp } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>

<BasicMessage {timestamp} class="text-sm place-items-center" outer_class="hover:bg-neutral-50" highlight={nick.color[2]}>
	<span
		class="text-fuchsia-700 font-bold flex justify-end place-items-center"
		aria-hidden
		slot="sender"
	>
		<Pencil weight="bold" />
	</span>
	<span slot="content">
		<b class={nick.color[0]}>{nick.name}</b> changed the topic:
	</span>

	<blockquote
		slot="after"
		class="ml-[7.5rem] mt-1.5 pb-0.5 border-l-2 border-l-neutral-300 pl-4 text-neutral-800 italic
			text-sm leading-relaxed"
			
	>
		{content ? content : null}
	</blockquote>
</BasicMessage>

<style>
	b {
		@apply font-semibold;
	}
</style>
