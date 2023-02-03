<script lang="ts">
	import { goto } from '$app/navigation';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Toggle from '$lib/Display/Forms/Toggle.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import DialogBase from '../Base/Base.svelte';

	export let isopen = false;
	export let conn: IrcConnection;

	let name: string = '';
	let autojoin: boolean = true;

	async function join_channel(close_diag: () => void) {
		autojoin ? await conn.join_persistent_channel(name) : await conn.join_channel(name);
		goto(`./${encodeURIComponent(name.replaceAll('/', '%2F'))}/`);
		close_diag();
		name = '';
	}
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-[32rem]">
	<form class="flex flex-col h-full">
		<Heading1 class="text-center">Join a Channel</Heading1>
		<p class="my-4 prose prose-sm">
			Channels are shared spaces to talk about whatever. If you know the name of the one you want,
			you can type it below. or you can check out the <a href="./browse">channel browser</a>.
		</p>

		<TextInput placeholder="#tubes" bind:value={name} class="mb-4">
			<h3>Channel Name</h3>
			<p>if the channel doesn't exist, it'll be created for you.</p>
		</TextInput>

		<Toggle checked bind:value={autojoin}>
			<h3 class="mb-0">Automatically join this channel</h3>
			<p>join this channel when you connect to this network</p>
		</Toggle>

		<div class="mt-auto">
			<div class="flex mt-4">
				<SecondaryButton on:click={close}>nevermind</SecondaryButton>
				<PrimaryButton type="submit" class="ml-auto" on:click={() => join_channel(close)}>
					let's do it
				</PrimaryButton>
			</div>
		</div>
	</form>
</DialogBase>
