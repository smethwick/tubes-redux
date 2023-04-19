<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import MessageTemplate from '../MessageTemplate.svelte';
	import Pencil from 'phosphor-svelte/lib/PencilSimple';

	export let msg: Message;
	const { source: full_source, content, timestamp } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>

<MessageTemplate
	{timestamp}
	class="place-items-center text-sm"
	outer_class="hover:bg-neutral-50 dark:hover:bg-neutral-800"
	highlight={nick.color[2]}
>
	<span
		class="flex place-items-center justify-end font-bold text-fuchsia-700"
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
		class="ml-[8.75rem] mt-1.5 border-l-2 border-l-neutral-300 pb-0.5 pl-5 text-sm italic
			leading-relaxed text-neutral-800"
	>
		{content ? content : null}
	</blockquote>
</MessageTemplate>

<style>
	b {
		@apply font-semibold;
	}
</style>
