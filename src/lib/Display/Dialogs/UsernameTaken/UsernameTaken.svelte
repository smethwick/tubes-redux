<script lang="ts">
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import DialogBase from '../Base/Base.svelte';

	export let isopen = true;
	export let conn: IrcConnection;
    export let new_nick: string = conn.connection_info.nick;
	export let reconnect: () => void;
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-96">
	<Heading1 class="text-center">Nickname In Use</Heading1>
	<p class="mt-2">
		the nickname you specified is already in use on this network. enter a new one below and give it
		another go
	</p>
	<form class="mt-4 flex flex-col h-full">
		<TextInput bind:value={new_nick}>
            <h3>Nickname</h3>
            <p>This is how you're identified on the network.</p>
        </TextInput>

		<div class="mt-auto">
			<div class="flex mt-4">
				<SecondaryButton on:click={close}>nevermind</SecondaryButton>
				<PrimaryButton
					type="submit"
					class="ml-auto"
					on:click={() => {
						close();
                        conn.connection_info = {...conn.connection_info, nick: new_nick}
						reconnect();
					}}
				>
					give it another go
				</PrimaryButton>
			</div>
		</div>
	</form>
</DialogBase>
