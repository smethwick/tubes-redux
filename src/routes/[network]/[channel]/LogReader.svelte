<script lang="ts">
	import { current_style } from '$lib/Chat';
	import type { MessageLogList } from '$lib/Chat/logs';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { Message } from '$lib/Storage/messages';
	import MessageGroupView from './MessageGroupView.svelte';
	import { group, isAComponent, isAGroup } from './grouper';

	export let log: MessageLogList;
	export let conn: IrcConnection;
	export let last_read: Message | undefined = undefined;

	const store = log.store;
	$: grouped = group($store, { last_read });
</script>

<ul class="flex flex-col">
	{#each grouped as msg}
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
</ul>
