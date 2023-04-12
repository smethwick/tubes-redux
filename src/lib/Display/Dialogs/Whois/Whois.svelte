<script lang="ts">
	import type { Nick } from '$lib/Chat/nick';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import Join from '$lib/Display/Chat/MessageTypes/Join.svelte';
	import Spinner from '$lib/Display/Etc/Spinner.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import DialogBase from '../Base/Base.svelte';

	export let isopen = false;
	export let conn: IrcConnection;
	export let nick: Nick;
</script>

<DialogBase bind:isopen let:close width="max-w-2xl" class="h-96">
	{#await nick.whois(conn)}
		<Spinner />
	{:then whois}
		aaaa {whois.map(o => o.params.join(" "))}
	{/await}
    <SecondaryButton class="mt-auto" on:click={close}>Close</SecondaryButton>
</DialogBase>
