<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import EmojiPicker from '$lib/Display/Chat/EmojiPicker/EmojiPicker.svelte';

	export let isConnected, channel: Channel | undefined, channel_name: string;

	let input = '';
</script>

<div
	class="flex h-[3rem] max-h-[3rem] min-h-[3rem] w-full place-items-center
	border-t border-t-neutral-200 px-4 dark:border-t-neutral-700"
>
	<input
		class=" h-full w-full bg-inherit focus-visible:outline-none"
		placeholder={$isConnected
			? `say something to ${channel_name}`
			: 'not connected to this network'}
		bind:value={input}
		disabled={!$isConnected}
		class:disabled={!$isConnected}
		on:keydown={(e) => {
			if (e.key == 'Enter' && input && channel) {
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
