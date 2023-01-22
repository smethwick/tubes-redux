<script lang="ts">
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';

	export let msg: Message;
	const  {source: full_source, target, content} = msg;
	const source = full_source ? full_source[0] : "Unknown";
</script>

<BasicMessage>
	<span slot="sender">{source}</span>
	<span slot="content">{content}</span>
</BasicMessage>
