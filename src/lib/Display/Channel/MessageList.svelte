<script lang="ts">
	import type { MessageLogList } from '$lib/Chat/logs';
	import { onMount, tick } from 'svelte';
	import { condense } from './condense';
	import CondensedItemView from './CondensedItemView.svelte';

	export let backlog: MessageLogList | undefined;
	export let session: MessageLogList;

	const session_store = session.store;
	const backlog_store = backlog?.store;

	$: messages = condense([...($backlog_store ?? []), ...$session_store]);

	// let div: Element;

	onMount(async () => {
		await tick();
		// div.scrollTo({ top: 100 });
	});
</script>

<div class="flex flex-col-reverse h-full max-h-full overflow-scroll">
	{#each messages.slice().reverse() as message}
		<CondensedItemView item={message} />
	{/each}
</div>
