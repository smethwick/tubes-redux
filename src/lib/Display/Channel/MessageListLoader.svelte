<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Channel } from '$lib/Chat/channel';
	import Spinner from '$lib/Display/Etc/Spinner.svelte';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import { MessageLogList } from '$lib/Chat/logs';
	import MessageList from './MessageList.svelte';

	export let channel: Channel;
	export let connection: IrcConnection;
	let ready = false;

	onMount(async () => {
		if (!channel.backlog)
			channel.backlog = await MessageLogList.fromChatHistory(
				connection,
				channel.name
			);
		await channel.backlog.open();
		await channel.session.open();
		ready = true;
	});

	onDestroy(async () => {
		await channel.session.deactivate();
	});
</script>

{#if ready}
	<MessageList backlog={channel.backlog} session={channel.session} />
{:else}
	<div class="flex w-full h-full justify-center place-items-center">
		<Spinner />
	</div>
{/if}
