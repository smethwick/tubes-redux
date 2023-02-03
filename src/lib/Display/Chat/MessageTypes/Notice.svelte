<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';
	import Color from 'color';

	export let msg: Message;
	const  {source: full_source, content} = msg;
	const source = full_source ? full_source[0] : "Unknown";

	const nick = new Nick(source);
	
	let color = Color(nick.color).lightness(95).string();
</script>

<span style="--colour: {color}">
	<BasicMessage class="hover:bg-[color:var(--colour)] bg-opacity-20">
		<span slot="sender" style="color: {nick.color}">📣 {nick.name}</span>
		<span slot="content">{content}</span>
	</BasicMessage>
</span>
