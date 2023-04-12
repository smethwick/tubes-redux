<script lang="ts">
	import type { Nick } from '$lib/Chat/nick';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import Spinner from '$lib/Display/Etc/Spinner.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import DialogBase from '../Base/Base.svelte';
	import Registered from './registered.png';

	export let isopen = false;
	export let conn: IrcConnection;
	export let nick: Nick;
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-96">
	{#await nick.whois(conn)}
		<div class="max-w-min"><Spinner /></div>
	{:then { registered, nick, realname, username }}
		<main>
			{#if registered}
				<img
					class="float-right w-48 rotate-2"
					style="filter: drop-shadow(-2px 2px 4px rgba(0,0,0,0.2));"
					src={Registered}
					alt="{nick} is registered on this network"
				/>
			{/if}
			<Heading1>{nick}</Heading1>
			<p class="text-xl text-neutral-800">{realname}</p>
			<p class="text-sm mt-2">{username}</p>
		</main>
	{/await}
	<SecondaryButton class="mt-auto max-w-max" on:click={close}>Close</SecondaryButton>
</DialogBase>
