<script lang="ts">
	import type { Message } from '$lib/Storage/messages';
	import BasicMessage from '../BasicMessage.svelte';

	export let msg: Message;
</script>

<BasicMessage timestamp={msg.timestamp} class="text-red-700" highlight="red">
	<span slot="sender">⚠️</span>
	<span slot="content">{JSON.stringify(msg)}</span>
</BasicMessage>

<style>
    b {
        @apply font-semibold
    }
</style>
