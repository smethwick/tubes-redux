<script lang="ts">
	import type { Message } from '$lib/Storage/messages';
	import { showMessage } from '.';

	export let msg: Message;

	let comp = showMessage(msg);
</script>

{#await comp}
	hold on....
{:then comp}
	<svelte:component this={comp} {msg} />
{:catch}
	<p>failed to display this message</p>
{/await}
