<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import type { Message } from '$lib/Storage/messages';
	import { onMount, tick } from 'svelte';

	export let msgs: Message[];

	const scrollToBottom = (node: Element, list: Array<unknown>) => {
		const scroll = async (list: Array<unknown>) =>
			await tick();
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
	class="flex flex-col {$message_layout == 'comfy'
		? 'gap-2'
		: 'gap-0.5'} min-w-full max-w-full overflow-y-auto h-full max-h-screen p-4 py-4"
>
	{#each msgs as msg (msg.id)}
		<MessageView {msg} />
	{/each}
</div>
