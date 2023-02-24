<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { Message } from '$lib/Storage/messages';
	import { onMount, tick } from 'svelte';
	import type { MessageGroup } from '$lib/Chat/groups';
	import MessageGroupView from './MessageGroupView.svelte';
	import { group, isAGroup, NotAMessage } from './grouper';
	import { on_mount, scrollToBottom } from './list';
	import type { Channel } from '$lib/Chat/channel';
	import Spinner from '$lib/Display/Etc/Spinner.svelte';
	import MessageListInner from './MessageListInner.svelte';

	// export let msgs: Message[];

	export let channel: Channel;
	let grouped: (Message | MessageGroup | NotAMessage<unknown>)[];

	onMount(async () => {
		await channel.logs.open();
		await channel.session_frame.open();
		grouped = channel.logs.frames.flatMap((o) => group(o.messages));
	});
</script>

{#if grouped}
	<MessageListInner {channel} msgs={grouped} />
{:else}
	<div class="flex w-full h-full justify-center place-items-center">
		<Spinner />
	</div>
{/if}
