<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import { CommandHandler } from '$lib/Chat/commands';
	import EmojiPicker from '$lib/Display/Chat/EmojiPicker/EmojiPicker.svelte';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	export let isConnected, channel: Channel | undefined, channel_name: string;

	let input = '',
		error = '';
</script>

{#if error}
	<div
	transition:slide={{duration: 200, easing: cubicOut}}
		class="flex h-8 place-items-center 
		border-t border-t-rose-950/25 bg-rose-400 
		px-6 text-sm text-rose-950"
	>
		{error}
	</div>
{/if}

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
		on:keydown={async (e) => {
			if (e.key == 'Enter' && input && channel) {
				if (input.startsWith('/')) {
					try {
						await CommandHandler.run(input, channel.name, channel.conn);
						input = '';
					} catch (e) {
						error = String(e);
						setTimeout(() => {
							error = '';
						}, 5000);
					}
				} else {
					channel.privmsg(input);
					input = '';
				}
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
