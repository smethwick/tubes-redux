<script lang="ts">
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import { onMount } from 'svelte';
	import MessageGroupView from './MessageGroupView.svelte';
	import { group, isAGroup, isAComponent } from './grouper';
	import { on_mount, scrollToBottom } from './list';
	import type { Channel } from '$lib/Chat/channel';
	import { current_style } from '$lib/Chat';
	import ShowMore from './ShowMore.svelte';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	let div: Element;

	export let conn: IrcConnection;
	export let channel: Channel;

	const backlog = channel.backlog!;
	const backlog_live = channel.backlog!.store;
	const session = channel.session.store;

	$: backlog_grouped = group($backlog_live);
	$: session_grouped = group($session, {
		last_read: channel.session.last_read
	});
	$: pending = channel.pending_live;

	onMount(async () => {
		await on_mount(div);
	});

	const handleScroll = (
		event: UIEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) => {
		const height = event.currentTarget.scrollHeight;
		const scroll_pos = event.currentTarget.scrollTop;
		const view_height = event.currentTarget.clientHeight;
		const scroll = height - (scroll_pos + view_height);

		if (scroll < 10) {
			channel.session.open();
		} else {
			channel.session.deactivate();
		}
	};
</script>

<div
	bind:this={div}
	on:scroll={(e) => handleScroll(e)}
	use:scrollToBottom={{ list: [...session_grouped, ...$pending], channel }}
	class="h-full max-h-screen min-w-full max-w-full overflow-y-auto p-4 py-4"
>
	<ShowMore
		on:click={() => {
			const last = $backlog_live.at(0);
			if (!last) return;

			backlog.load_more(conn, channel.name, ['timestamp', last.timestamp]);
			backlog_grouped = group($backlog_live);
		}}
	/>
	{#each [...backlog_grouped, ...session_grouped] as msg}
		{#if isAGroup(msg)}
			<MessageGroupView group={msg} />
		{:else if isAComponent(msg)}
			<svelte:component
				this={msg.comp}
				style={$current_style}
				params={msg.params}
			/>
		{:else}
			{#key msg.id}
				<MessageView {conn} {msg} />
			{/key}
		{/if}
	{/each}
	<div class="opacity-50">
		{#each $pending as msg}
			{#key msg.id}
				<MessageView {conn} {msg} />
			{/key}
		{/each}
	</div>
</div>
