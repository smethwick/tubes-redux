<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { Message } from '$lib/Storage/messages';
	import { onMount, tick } from 'svelte';
	import type { MessageGroup } from '$lib/Chat/groups';
	import MessageGroupView from './MessageGroupView.svelte';
	import { group, isAGroup, isntAMessage, NotAMessage } from './grouper';
	import { on_mount, scrollToBottom } from './list';
	import type { Channel } from '$lib/Chat/channel';
	import { current_style } from '$lib/Chat';

	let div: Element;

	export let channel: Channel;
	export let msgs: (Message | MessageGroup | NotAMessage<unknown>)[];

	$: frame = channel.session.store;
	$: session_grouped = group($frame);

	onMount(async () => {
		await on_mount(div, channel);
	});
</script>

<div
	bind:this={div}
	use:scrollToBottom={session_grouped}
	class="min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4"
>
	{#each [...msgs, ...session_grouped] as msg}
		{#if isAGroup(msg)}
			<MessageGroupView group={msg} />
		{:else if isntAMessage(msg)}
			<svelte:component this={msg.comp} style={$current_style} params={msg.params} />
		{:else}
			{#key msg.id}
				<MessageView {msg} />
			{/key}
		{/if}
	{/each}
</div>
