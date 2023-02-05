<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import type { conn_styles, IrcConnection } from '$lib/Chat/provider+connection';
	import EmojiPicker from '$lib/Display/Chat/EmojiPicker/EmojiPicker.svelte';

	export let isConnected, channel: Channel | undefined, channel_name: string;

	export let styles: conn_styles;
	const { color_name: color } = styles;

	let input = '';
</script>

<div class="flex w-full border-t px-4 border-t-neutral-200 h-14 place-items-center">
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
	<EmojiPicker {styles} bind:value={input} />
</div>

<style>
	.disabled {
		@apply italic;
	}
</style>
