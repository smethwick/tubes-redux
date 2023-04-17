<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import EmojiPicker from '$lib/Display/Chat/EmojiPicker/EmojiPicker.svelte';

	export let isConnected, channel: Channel | undefined, channel_name: string;

	let input = '';
</script>

<div class="flex w-full border-t px-4 border-t-neutral-200 min-h-[3rem] h-[3rem] max-h-[3rem] place-items-center">
	<input
		class=" h-full w-full focus-visible:outline-none"
		placeholder={$isConnected
			? `say something to ${channel_name}`
			: 'not connected to this network'}
		bind:value={input}
		disabled={!$isConnected}
		class:disabled={!$isConnected}
		on:keydown={(e) => {
			if (e.key == 'Enter' && channel) {
				channel.privmsg(input);
				input = '';
			}
		}}
	/>
	<EmojiPicker bind:value={input} />
</div>

<style>
	.disabled {
		@apply italic;
	}
</style>
