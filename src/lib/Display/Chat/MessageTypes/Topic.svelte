<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';
	import Pencil from 'phosphor-svelte/lib/PencilSimple';

	export let msg: Message;
	const { source: full_source, content } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>

<BasicMessage class="text-sm hover:bg-neutral-50 place-items-center">
	<span
		class="text-fuchsia-700 font-bold flex justify-end place-items-center"
		aria-hidden
		slot="sender"
	>
		<Pencil weight="bold" />
	</span>
	<span slot="content">
		<b class={nick.color[0]}>{nick.name}</b> changed the topic to {content ? content : null}
	</span>
</BasicMessage>

<style>
	b {
		@apply font-semibold;
	}
</style>
