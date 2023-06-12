<script lang="ts">
	import type { MessageLogList } from "$lib/Chat/logs";
	import { onMount, tick } from "svelte";

    export let backlog: MessageLogList | undefined;
    export let session: MessageLogList;

    const session_store = session.store;
    const backlog_store = backlog?.store;

    $: messages = [...($backlog_store ?? []), ...$session_store];

    let div: Element;

    onMount(async () => {
        await tick();
        div.scrollTop = 100;
    })
</script>

<div bind:this={div} class="flex flex-col-reverse max-h-full overflow-scroll">
    {#each messages.slice().reverse() as message}
        <div>{message.content}</div>
    {/each}
</div>
