<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { Message } from '$lib/Storage/messages';
	import { onMount, tick } from 'svelte';
	import type { MessageGroup } from '$lib/Chat/groups';
	import MessageGroupView from './MessageGroupView.svelte';
	import { group, isAGroup, isAComponent, ComponentAdapter } from './grouper';
	import { on_mount, scrollToBottom } from './list';
	import type { Channel } from '$lib/Chat/channel';
	import { current_style } from '$lib/Chat';
	import ShowMore from './ShowMore.svelte';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	let div: Element;

	export let conn: IrcConnection;
	export let channel: Channel;

	$: backlog = channel.backlog!;
	$: backlog_live = channel.backlog!.store;
	$: session = channel.session.store;

	$: backlog_grouped = group($backlog_live);
	$: session_grouped = group($session);

	onMount(async () => {
		await on_mount(div, channel);
	});
</script>

<div
	bind:this={div}
	use:scrollToBottom={session_grouped}
	class="h-full max-h-screen min-w-full max-w-full overflow-y-auto p-4 py-4"
>
	<ShowMore
		on:click={() => {
			const last = $backlog_live.at(0);
			if (!last) return;
			
			backlog.load_more(conn, channel.name, ['timestamp', last.timestamp]);
			backlog_grouped = group($backlog_live)
		}}
	/>
	{#each [...backlog_grouped, ...session_grouped] as msg}
		{#if isAGroup(msg)}
			<MessageGroupView group={msg} />
		{:else if isAComponent(msg)}
			<svelte:component this={msg.comp} style={$current_style} params={msg.params} />
		{:else}
			{#key msg.id}
				<MessageView {msg} />
			{/key}
		{/if}
	{/each}
</div>
