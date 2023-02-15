<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';
	import Color from 'color';

	export let msg: Message;
	const { source: full_source, timestamp, content } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
</script>

<BasicMessage {timestamp} class="{nick.color[1]} bg-opacity-20" highlight={nick.color[2]}>
	<span slot="sender" class={nick.color[0]}>{nick.name}</span>
	<span slot="content">{content}</span>
</BasicMessage>
