<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Channel } from '$lib/Chat/channel';
	import Spinner from '$lib/Display/Etc/Spinner.svelte';
	import MessageListInner from './MessageListInner.svelte';
	import { MessageLogList } from '$lib/Chat/logs';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	// export let msgs: Message[];

	export let channel: Channel;
	export let conn: IrcConnection;
	let ready = false;

	onMount(async () => {
		if (!channel.backlog) channel.backlog = await MessageLogList.fromChatHistory(conn, channel.name);
		await channel.backlog.open();
		await channel.session.open();
		ready = true
	});

	onDestroy(async () => {
		await channel.session.deactivate();
	})
</script>

{#if ready}
	<MessageListInner {conn} {channel}/>
{:else}
	<div class="flex w-full h-full justify-center place-items-center">
		<Spinner />
	</div>
{/if}
