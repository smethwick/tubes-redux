<script lang="ts">
	import { goto } from '$app/navigation';
	import { provider } from '$lib/Chat';
	import { ProviderFlags } from '$lib/Chat/flags';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Toggle from '$lib/Display/Forms/Toggle.svelte';
	import List from '$lib/Display/Lists/List.svelte';
	import Item from '$lib/Display/Lists/ListItem.svelte';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';
	import Plus from 'phosphor-svelte/lib/Plus';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	let protos = provider.supported_protos;
	const {
		connection,
		connection: { connection_info: ci }
	} = data;

	let {
		url,
		nick,
		realname,
		display_name,
		autojoin,
		icon,
		name,
		secure,
		username,
		server_password,
		sasl
	} = ci;

	sasl = sasl ?? { username: '', password: '' };
	$: sasl_enabled = Boolean(sasl); 
	let thing_to_add = '';
</script>

<Content>
	<Header back>
		Edit {display_name}
	</Header>

	<h2>Connection</h2>
	<TextInput bind:value={url}>
		<h3>Network URL</h3>
		<p class="mb-0">
			if you're not sure what this is, you can <button class="underline">
				key in the details manually
			</button>
		</p>
		<p class="mt-0">
			(Your provider supports these protocols:
			{@html protos.map((o) => `<code>${o}://</code>`).join(', ')})
		</p>
	</TextInput>
	{#if url != ci.url}
		<div class="mt-4 italic text-sm" transition:slide={{ duration: 100, easing: quadOut }}>
			⚠️ These changes will be applied when you reconnect to this network.
		</div>
	{/if}
	<h2>You</h2>
	<div class="grid grid-cols-2 gap-4">
		<TextInput bind:value={nick}>
			<h3>Nickname</h3>
			<p>This is how you're identified on the network</p>
		</TextInput>
		<TextInput bind:value={realname}>
			<h3>Realname</h3>
			<p>Your real name, or any other details people might want to know about you.</p>
		</TextInput>
	</div>

	<h2>Authentication</h2>
	<Toggle bind:value={sasl_enabled}>
		<h3>Use an account</h3>
	</Toggle>
	<div class="grid grid-cols-2 gap-4 mt-4">
		{#if sasl_enabled && sasl}
			<TextInput bind:value={sasl.username}>
				<h3>Username</h3>
				<p>This is how you're identified on the network</p>
			</TextInput>
			<TextInput type="password" bind:value={sasl.password}>
				<h3>Password</h3>
				<p>Your real name, or any other details people might want to know about you.</p>
			</TextInput>
		{/if}
	</div>

	{#if provider.has_flag(ProviderFlags.Autojoin)}
	<h2>Channels</h2>
	These channels will be joined ✨ automatically when you connect to {display_name}.

	<form class="not-prose my-4">
		<List bg="bg-neutral-50">
			{#each autojoin as chan, i}
				<Item icon={Hash}>
					{chan.replace('#', '')}
					<button
						class="ml-auto underline"
						type="button"
						on:click={() => (autojoin = autojoin.filter((_, index) => i != index))}
					>
						Remove
					</button>
				</Item>
			{/each}
			<Item icon={Plus}>
				<input
					bind:value={thing_to_add}
					type="text"
					class="bg-transparent border-0 p-0 w-full"
					placeholder="type a channel and hit enter"
				/>
				<button
					class="ml-auto underline"
					type="submit"
					on:click={(e) => {
						if (!thing_to_add.startsWith('#')) thing_to_add = `#${thing_to_add}`;
						autojoin = [...autojoin, thing_to_add];
						thing_to_add = '';
					}}
				>
					Add
				</button>
			</Item>
		</List>
	</form>
	{/if}

	<h2>Hellzone</h2>

	<div class="flex">
		<SecondaryButton on:click={() => goto('./home')}>Cancel</SecondaryButton>
		<PrimaryButton
			class="ml-auto"
			on:click={() => {
				connection.update_connection_info({
					url,
					realname,
					nick,
					username,
					autojoin,
					icon,
					name,
					secure,
					display_name,
					server_password,
					sasl: (sasl?.username && sasl?.password) ? sasl : undefined,
				});
				goto(`./home`);
			}}
		>
			Save & Finish
		</PrimaryButton>
	</div>
</Content>
