<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { Message } from '$lib/Storage/messages';
	import { onMount, tick } from 'svelte';
	import type { MessageGroup } from '$lib/Chat/groups';
	import MessageGroupView from './MessageGroupView.svelte';
	import { group, isAGroup } from './grouper';
	import { on_mount, scrollToBottom } from './list';

	export let msgs: Message[];
	let grouped: (Message | MessageGroup)[] = group(msgs);
	let div: Element;

	onMount(async () => await on_mount(div));
</script>

<div
	bind:this={div}
	use:scrollToBottom={msgs}
	class="min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4"
>
	{#each grouped as msg}
		{#if isAGroup(msg)}
			<MessageGroupView group={msg} />
		{:else}
			{#key msg.id}
				<MessageView {msg} />
			{/key}
		{/if}
	{/each}
</div>
