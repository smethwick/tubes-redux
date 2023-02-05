<script lang="ts">
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import DialogBase from '../Base/Base.svelte';

	export let isopen = true;
    export let conn: IrcConnection;
    export let reconnect: () => void;
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-[95vh]">
	<Heading1 class="text-center">Username Taken</Heading1>

	<div class="mt-auto">
		<div class="flex mt-4">
			<SecondaryButton on:click={close}>nevermind</SecondaryButton>
			<PrimaryButton class="ml-auto" on:click={() => { close(); reconnect(); }}>
				Give it another go
			</PrimaryButton>
		</div>
	</div>
</DialogBase>
