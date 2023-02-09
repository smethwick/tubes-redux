<script lang="ts">
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';
	import { v4 as uuidv4 } from 'uuid';
	import { provider } from '$lib/Chat';
	import { goto } from '$app/navigation';
	import MiniDialog from '../Base/MiniDialog.svelte';

	export let isopen = false;

	let url: string;

	async function add_network() {
		if (!url) return;
		let uuid = uuidv4();
		let new_network: ConnectionInfo = {
			name: uuid,
			display_name: 'Unlabeled',
			icon: '',
			url,
			secure: true,
			autojoin: [],
			nick: 'tubes_user',
			realname: 'https://leahc.gay/tubes',
			username: 'tubes'
		};
		provider.add_persistent_connection(new_network);
		goto(`/${uuid}/home`);
		url = '';
		isopen = false;
	}
</script>

<MiniDialog
	title="Add a Network"
	bind:isopen
	bind:value={url}
	on:click={() => add_network()}
	placeholder="network uri"
>
	<svelte:fragment slot="bit at the bottom">
		<a href="/manual/uris">what's this?</a> •
		<button>use hostname & port instead</button>
	</svelte:fragment>
</MiniDialog>

<!-- <DialogBase bind:isopen let:close width="max-w-2xl" class="h-[95vh]">
	<Heading1 class="text-center">Add a Network</Heading1>

	<form class="flex flex-col my-4">
		<TextInput bind:value={url} placeholder="ircs://irc.example.com:[port]/" class="mb-6">
			<h2 class="mb-0">Network URL</h2>
			<p>
				if you aren't sure what this is, you can
				<button type="button" class="underline"> key in the details manually</button>.
			</p>
		</TextInput>

		<TextInput bind:value={name} placeholder="my cool network :)">
			<h2 class="mb-0">Label</h2>
			<p>This is what the network will be called inside Tubes.</p>
		</TextInput>

		<div class="grid grid-cols-2 gap-3 mt-6 mb-2">
			<TextInput bind:value={nick} placeholder="gerald">
				<h2 class="mb-0">Nickname</h2>
				<p>this is how you're identified on the network.</p>
			</TextInput>
			<TextInput bind:value={realname} placeholder="gerald basingstoke (they/them)">
				<h2 class="mb-0">Real Name</h2>
				<p>your real name, or other details people might want to know about you.</p>
			</TextInput>
		</div>

		<Collapsible inside_class="grid grid-cols-2 gap-3 mt-2 mb-4">
			<svelte:fragment slot="summary">
				<h2 class="mb-0">Account</h2>
				<p>already have an account on this network? pop your details here.</p>
			</svelte:fragment>
			<TextInput bind:value={username} placeholder="gerald">
				<h3 class="mb-0">Username</h3>
			</TextInput>
			<TextInput bind:value={password} placeholder="hunter2" type="password">
				<h3 class="mb-0">Password</h3>
				<p />
			</TextInput>
		</Collapsible>

		<Collapsible inside_class="flex flex-col gap-3 mt-2 mb-4">
			<svelte:fragment slot="summary">
				<h2 class="mb-0 italic">Advanced</h2>
				<p>bonus toggles for irc nerds.</p>
			</svelte:fragment>
			<Toggle bind:value={insecure}>
				<h3 class="mb-0">Accept invalid SSL certificates</h3>
				<p>this is probably a bad idea. don't check this one</p>
			</Toggle>
		</Collapsible>
	</form>
	<div class="mt-auto">
		<div class="flex mt-4">
			<SecondaryButton on:click={close}>nevermind</SecondaryButton>
			<PrimaryButton class="ml-auto" on:click={() => add_network(close)}>
				get silly with it
				<span class="text-sm">(this is a confirm button, to be clear)</span>
			</PrimaryButton>
		</div>
	</div>
</DialogBase> -->
