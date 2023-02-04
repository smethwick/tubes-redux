<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import { MessageTypes, type Message } from '$lib/Storage/messages';
	import { onMount, tick } from 'svelte';
	import { MessageGroup } from '$lib/Chat/groups';
	import MessageInput from './MessageInput.svelte';
	import MessageGroupView from './MessageGroupView.svelte';

	export let msgs: Message[];

	let groupable_types = [MessageTypes.Join, MessageTypes.Quit, MessageTypes.Part];
	let grouped: (Message | MessageGroup)[] = [];

	const isAGroup = (input: Message | MessageGroup): input is MessageGroup => {
		if (input.hasOwnProperty('messages')) return true;
		else return false;
	};

	msgs.forEach((o) => {
		if (groupable_types.includes(o.type)) {
			const last_elem = grouped.at(grouped.length - 1);
			if (last_elem && isAGroup(last_elem)) last_elem.add(o);
			else grouped.push(new MessageGroup([o]));
		} else grouped.push(o);
	});

	console.log(grouped);

	const scrollToBottom = (node: Element, list: Array<unknown>) => {
		const scroll = async (list: Array<unknown>) => await tick();
		node.scroll({
			top: node.scrollHeight,
			behavior: 'smooth'
		});
		scroll(list);

		return { update: scroll };
	};

	let div: Element;

	onMount(async () => {
		await tick();

		div.scroll({
			top: div.scrollHeight
		});
	});
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
