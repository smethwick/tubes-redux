<script lang="ts">
	import type { Message } from '$lib/Storage/messages';
	import MessageTemplate from '../MessageTemplate.svelte';

	export let msg: Message;
</script>

<MessageTemplate timestamp={msg.timestamp} class="text-red-700" highlight="red">
	<span slot="sender">⚠️</span>
	<span slot="content">{JSON.stringify(msg)}</span>
</MessageTemplate>
