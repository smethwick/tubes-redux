<script lang="ts">
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';

	export let msg: Message;
	const  {source: full_source, content} = msg;
	const source = full_source ? full_source[0] : "Unknown";
</script>

<BasicMessage class="text-rose-700">
	<span slot="sender">←</span>
	<span slot="content"><b>{source}</b> has quit {content ? `(${content})` : null}</span>
</BasicMessage>

<style>
    b {
        @apply font-semibold
    }
</style>