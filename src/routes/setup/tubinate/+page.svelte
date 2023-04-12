<script lang="ts">
	import { goto } from '$app/navigation';
	import { provider } from '$lib/Chat';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import ErrorBox from '$lib/Display/Error/ErrorBox.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { error } = data;

	let url = localStorage.getItem('url') ?? '',
		username = localStorage.getItem('username') ?? '',
		password = localStorage.getItem('password') ?? '';
</script>

<main class="mx-auto my-16 h-full w-full max-w-screen-sm">
	<Heading1>Log In</Heading1>
	<p class="prose mt-2">
		This edition of Tubes is set up to accept connections to <b>{provider.friendly_name}</b>.
	</p>

	{#if error}
		<ErrorBox>{error}</ErrorBox>
	{/if}

	<form class="my-8 flex w-full flex-col gap-5">
		<TextInput placeholder="wss://irc.example.gay" bind:value={url}>
			<h2 class="mb-0">Server URL</h2>
			<p class="mt-0">(ws:// or wss:// please)</p>
		</TextInput>
		<TextInput placeholder="AzureDiamond" bind:value={username}>
			<h2>Username</h2>
		</TextInput>
		<TextInput placeholder="hunter2" type="password" bind:value={password}>
			<h2>Password</h2>
		</TextInput>
		<PrimaryButton
			on:click={() => {
				localStorage.setItem('username', username);
				localStorage.setItem('password', password);
				localStorage.setItem('url', url);
				window.location.assign('/');
			}}
			disabled={!Boolean(username && password && url)}
			type="submit"
			class="w-max"
		>
			Log In
		</PrimaryButton>
	</form>
</main>
