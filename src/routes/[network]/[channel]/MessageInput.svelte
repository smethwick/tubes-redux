<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	export let isConnected, channel: Channel | undefined, channel_name: string, conn: IrcConnection;
	let input = '';
</script>

<input
	class="w-full border-t border-t-neutral-200 px-4 h-14 flex place-items-center focus-visible:outline-none"
	placeholder={$isConnected ? `say something to ${channel_name}` : 'not connected to this network'}
	bind:value={input}
	disabled={!$isConnected}
	class:disabled={!$isConnected}
	on:keydown={(e) => {
		if (e.key == 'Enter' && channel) {
			console.log(channel)
			channel.privmsg(input);
			input = '';
		}
	}}
/>

<style>
	.disabled {
		@apply italic;
	}
</style>
