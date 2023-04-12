<script lang="ts">
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import type { Message } from '$lib/Storage/messages';
	import { showMessage } from '.';

	export let conn: IrcConnection;
	export let msg: Message;

	let comp = showMessage(msg);
</script>

{#await comp}
	hold on....
{:then comp}
	<svelte:component this={comp} {conn} {msg} />
{:catch}
	<p>failed to display this message</p>
{/await}
