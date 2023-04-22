<script lang="ts">
	import type { Nick } from '$lib/Chat/nick';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import Spinner from '$lib/Display/Etc/Spinner.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import { parse } from 'postcss';
	import DialogBase from '../Base/Base.svelte';
	import Registered from './registered.png';
	import ErrorBox from '$lib/Display/Error/ErrorBox.svelte';

	export let isopen = false;
	export let conn: IrcConnection;
	export let nick: Nick;
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-96" padding="p-0">
	{#await nick.whois(conn)}
		<div class="max-w-min"><Spinner /></div>
	{:then { registered, nick: nick2, realname, username }}
		<div class="bg-{nick.color[3]}-300 h-8 w-full" />
		<main class="px-8 py-4">
			{#if registered}
				<img
					class="float-right w-48 rotate-2"
					style="filter: drop-shadow(-2px 2px 4px rgba(0,0,0,0.2));"
					src={Registered}
					alt="{nick2} is registered on this network"
				/>
			{/if}
			<Heading1>{nick2}</Heading1>
			<p class="text-xl text-neutral-800">{realname}</p>
			<p class="mt-2 text-sm">{username}</p>
		</main>
	{:catch e}
		<ErrorBox>
			{JSON.parse(e).params.at(-1)}
		</ErrorBox>
	{/await}
	<SecondaryButton
		class="mt-auto max-w-max m-8"
		colors={[`bg-${nick.color[3]}-200`, 'text-black']}
		on:click={close}
	>
		Close
	</SecondaryButton>
</DialogBase>
