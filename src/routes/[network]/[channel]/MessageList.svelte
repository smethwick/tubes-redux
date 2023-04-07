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
	import { MessageLogList } from '$lib/Chat/logs';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	// export let msgs: Message[];

	export let channel: Channel;
	export let conn: IrcConnection;
	let grouped: (Message | MessageGroup | NotAMessage<unknown>)[];

	onMount(async () => {
		if (!channel.backlog) channel.backlog = await MessageLogList.fromChatHistory(conn, channel.name);
		await channel.backlog.open();
		await channel.session.open();
		grouped = group(channel.backlog.messages);
	});
</script>

{#if grouped}
	<MessageListInner {channel} msgs={grouped} />
{:else}
	<div class="flex w-full h-full justify-center place-items-center">
		<Spinner />
	</div>
{/if}
