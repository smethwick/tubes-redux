<script lang="ts">
	import { goto } from '$app/navigation';
	import { provider } from '$lib/Chat';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';
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
		server_password
	} = ci;

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
			if you're not sure what this is, you can <button class="underline"
				>key in the details manually</button
			>
		</p>
		<p class="mt-0">
			(Your provider supports these protocols:
			{@html protos.map((o) => `<code>${o}://</code>`).join(', ')})
		</p>
	</TextInput>
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
	<h2>Channels</h2>
	These channels will be joined ✨ automatically when you connect to {display_name}.

	<div class="not-prose">
		<ul class="flex flex-col gap-2 mt-4 mb-8">
			{#each autojoin as chan, i}
				<li class="px-4 py-2 bg-yellow-200 rounded-xl flex place-items-center gap-2">
					<Hash />{chan.replace('#', '')}

					<button
						class="ml-auto underline"
						on:click={() => (autojoin = autojoin.filter((_, index) => i != index))}
					>
						Remove
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<TextInput class="mb-4" bind:value={thing_to_add} placeholder="#tubes">
		<h3>Add a channel to the list</h3>
	</TextInput>
	<PrimaryButton
		on:click={(e) => {
			autojoin = [...autojoin, thing_to_add];
			thing_to_add = '';
		}}
		colors={['bg-yellow-300', 'text-black', 'outline-yellow-300']}>Add it!</PrimaryButton
	>

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
					server_password
				});
				goto(`./home`);
			}}
		>
			Save & Finish
		</PrimaryButton>
	</div>
</Content>
