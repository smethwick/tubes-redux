<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';

	export let msg: Message;
	const { source: full_source, target } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>

<BasicMessage class="text-cyan-700 hover:bg-cyan-50 text-sm">
	<span slot="sender">→</span>
	<span slot="content">
		<b style="color: {nick.color}">{nick.name}</b> has joined <b>{target}</b>
	</span>
</BasicMessage>

<style>
	b {
		@apply font-semibold;
	}
</style>
