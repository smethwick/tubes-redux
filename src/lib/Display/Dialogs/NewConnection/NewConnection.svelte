<script lang="ts">
	import { extract_bits_from_url } from '$lib/Chat/url';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import Collapsible from '$lib/Display/Etc/Collapsible.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Toggle from '$lib/Display/Forms/Toggle.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import DialogBase from '../Base/Base.svelte';

	export let isopen = false;

	let url: string, nick: string, realname: string, username: string, password: string, ssl: boolean;

	// async function add_network() {
	// 	extract_bits_from_url(url);
	// 	if (on_finish) on_finish();
	// }
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-[95vh]">
	<Heading1 class="text-center">Add a Network</Heading1>

	<form class="flex flex-col my-4">
		<TextInput bind:value={url} placeholder="ircs://irc.example.com:[port]/">
			<h2 class="mb-0">Network URL</h2>
			<p>
				if you aren't sure what this is, you can
				<button type="button" class="underline"> key in the details manually</button>.
			</p>
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
			<Toggle bind:value={ssl}>
				<h3 class="mb-0">Accept invalid SSL certificates</h3>
				<p>this is probably a bad idea. don't check this one</p>
			</Toggle>
			<TextInput bind:value={password} placeholder="piss" type="password">
				<h3 class="mb-0">Run commands on connection</h3>
				<p>these will run when after the network's connected. as the name implies.</p>
			</TextInput>
			<TextInput bind:value={username} placeholder="piss">
				<h3 class="mb-0">Username</h3>
			</TextInput>
			<TextInput bind:value={password} placeholder="piss" type="password">
				<h3 class="mb-0">Password</h3>
				<p />
			</TextInput>
		</Collapsible>
	</form>
	<div class="mt-auto">
		<div class="flex mt-4">
			<SecondaryButton on:click={close}>nevermind</SecondaryButton>
			<PrimaryButton class="ml-auto" on:click={close}>
				get silly with it
				<span class="text-sm">(this is a confirm button, to be clear)</span>
			</PrimaryButton>
		</div>
	</div>
</DialogBase>
