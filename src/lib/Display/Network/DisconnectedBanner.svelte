<script lang="ts">
	import type { IrcConnection, IrcMessageEvent } from '$lib/Chat/provider+connection';
	import type { SvelteComponent } from 'svelte';
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
	import UsernameTaken from '../Dialogs/UsernameTaken/UsernameTaken.svelte';
	import Spinner from '../Etc/Spinner.svelte';
	export let color: string;

	export let conn: IrcConnection;

	$: isConnected = conn.isConnected;
	$: connecting = $isConnected == 'connecting';

	let promise: Promise<typeof SvelteComponent | undefined> | undefined; 

	async function connect(): Promise<typeof SvelteComponent | undefined> {
		try {
			await conn.connect();
		} catch (e) {
			const err: IrcMessageEvent = JSON.parse(String(e).replace('Error: ', '') /* oops! jank! */);
			console.log(err);
			if (err.command == '433') {
				conn.disconnect();
				return UsernameTaken;
			} else throw e;
		}
	}
</script>

<article
	class="w-full h-[60vh] flex flex-col gap-2 place-items-center justify-center 
	bg-{color}-200 rounded-lg px-4 py-2"
>
	{#if !connecting}
		<h1 class="text-xl">you aren't connected to this network</h1>
		<PrimaryButton
			colors={[`bg-${color}-400`, 'text-black', `outline-${color}-400`]}
			class="text-sm"
			on:click={() => (promise = connect())}
		>
			Connect!
		</PrimaryButton>
	{/if}
	{#if promise}
		{#await promise}
			<Spinner />
		{:then comp}
			{#if comp}
				<svelte:component this={comp} reconnect={() => {promise = connect()}} {conn} />
			{/if}
		{:catch err}
			{err}
		{/await}
	{/if}
</article>

<style>
	h1 {
		font-stretch: expanded;
	}
</style>
